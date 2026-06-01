import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [categories, wilayas, priceRange] = await Promise.all([
      prisma.category.findMany({
        include: { _count: { select: { dishes: { where: { isAvailable: true } } } } },
        orderBy: { name: "asc" },
      }),
      prisma.cookProfile.groupBy({
        by: ["wilaya"],
        _count: { wilaya: true },
        orderBy: { _count: { wilaya: "desc" } },
      }),
      prisma.dish.aggregate({
        where: { isAvailable: true },
        _min: { price: true },
        _max: { price: true },
      }),
    ]);

    return NextResponse.json({
      categories: categories
        .filter((c) => c._count.dishes > 0)
        .map((c) => ({ name: c.name, slug: c.slug, count: c._count.dishes })),
      wilayas: wilayas.map((w) => ({ name: w.wilaya, count: w._count.wilaya })),
      priceRange: {
        min: priceRange._min.price || 0,
        max: priceRange._max.price || 10000,
      },
    });
  } catch (error) {
    console.error("Filter options error:", error);
    return NextResponse.json({ error: "Failed to load filters" }, { status: 500 });
  }
}
