import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || undefined;
    const city = searchParams.get("city") || undefined;
    const wilaya = searchParams.get("wilaya") || undefined;
    const specialty = searchParams.get("specialty") || undefined;
    const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : undefined;
    const sortBy = searchParams.get("sortBy") || "rating";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(parseInt(searchParams.get("limit") || "12"), 50);

    const where: any = { role: "COOK" };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { cookProfile: { bio: { contains: q, mode: "insensitive" } } },
      ];
    }

    if (city || wilaya) {
      where.cookProfile = {
        ...where.cookProfile,
        ...(city ? { wilaya: { contains: city, mode: "insensitive" } } : {}),
        ...(wilaya ? { wilaya: { contains: wilaya, mode: "insensitive" } } : {}),
      };
    }

    if (specialty) {
      where.cookProfile = {
        ...where.cookProfile,
        specialties: { has: specialty },
      };
    }

    if (minRating) {
      where.cookProfile = {
        ...where.cookProfile,
        avgRating: { gte: minRating },
      };
    }

    const orderBy: any = (() => {
      switch (sortBy) {
        case "orders": return { cookProfile: { totalOrders: "desc" as const } };
        case "newest": return { createdAt: "desc" as const };
        default: return { cookProfile: { avgRating: "desc" as const } };
      }
    })();

    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          cookProfile: true,
          _count: { select: { dishes: { where: { isAvailable: true } } } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      cooks: users.map((u: any) => ({
        id: u.id,
        name: u.name ?? "Cuisinier",
        initials: (u.name ?? "C")[0].toUpperCase(),
        wilaya: u.cookProfile?.wilaya ?? "",
        commune: u.cookProfile?.commune ?? "",
        avgRating: u.cookProfile?.avgRating ?? 0,
        totalOrders: u.cookProfile?.totalOrders ?? 0,
        dishCount: u._count?.dishes ?? 0,
        isVerified: u.cookProfile?.isVerified ?? false,
        bio: u.cookProfile?.bio ?? "",
      })),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + users.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Search cooks error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
