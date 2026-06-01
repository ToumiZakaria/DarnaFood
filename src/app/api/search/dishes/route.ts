import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || undefined;
    const category = searchParams.get("category") || undefined;
    const city = searchParams.get("city") || undefined;
    const wilaya = searchParams.get("wilaya") || undefined;
    const minPrice = searchParams.get("minPrice") ? parseFloat(searchParams.get("minPrice")!) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? parseFloat(searchParams.get("maxPrice")!) : undefined;
    const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : undefined;
    const isAvailable = searchParams.get("isAvailable") === "true" ? true : undefined;
    const sortBy = (searchParams.get("sortBy") as string) || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);

    const where: any = {};

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { cook: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    if (category && category !== "all") {
      where.category = { slug: category };
    }

    if (city || wilaya) {
      where.cook = {
        ...where.cook,
        cookProfile: {
          ...(city ? { wilaya: { contains: city, mode: "insensitive" } } : {}),
          ...(wilaya ? { wilaya: { contains: wilaya, mode: "insensitive" } } : {}),
        },
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (minRating) {
      where.cook = { ...where.cook, cookProfile: { ...where.cook?.cookProfile, avgRating: { gte: minRating } } };
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable;
    }

    const orderBy: any = (() => {
      switch (sortBy) {
        case "price_asc": return { price: "asc" as const };
        case "price_desc": return { price: "desc" as const };
        case "rating": return { rating: "desc" as const };
        case "popular": return { orderCount: "desc" as const };
        case "newest": return { createdAt: "desc" as const };
        default: return { createdAt: "desc" as const };
      }
    })();

    const skip = (page - 1) * limit;

    const [dishes, totalCount] = await Promise.all([
      prisma.dish.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          cook: { select: { id: true, name: true, cookProfile: { select: { wilaya: true, avgRating: true } } } },
          images: { where: { isPrimary: true }, take: 1, select: { url: true } },
          category: { select: { name: true, icon: true } },
        },
      }),
      prisma.dish.count({ where }),
    ]);

    return NextResponse.json({
      dishes: dishes.map((d) => ({
        id: d.id,
        name: d.name,
        price: d.price,
        prepTime: d.prepTime,
        description: d.description,
        cook: d.cook.name ?? "Cuisinier",
        cookId: d.cook.id,
        city: d.cook.cookProfile?.wilaya ?? "",
        rating: d.cook.cookProfile?.avgRating ?? 0,
        category: d.category.name,
        image: d.images[0]?.url ?? null,
        isAvailable: d.isAvailable,
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + dishes.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Search dishes error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
