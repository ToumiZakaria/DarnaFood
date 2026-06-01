import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    if (!q || q.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    const [dishes, cooks, categories] = await Promise.all([
      prisma.dish.findMany({
        where: {
          name: { contains: q, mode: "insensitive" },
          isAvailable: true,
        },
        select: { id: true, name: true, category: { select: { name: true } } },
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.findMany({
        where: {
          role: "COOK",
          name: { contains: q, mode: "insensitive" },
        },
        select: { id: true, name: true },
        take: 3,
      }),
      prisma.category.findMany({
        where: { name: { contains: q, mode: "insensitive" } },
        select: { id: true, name: true, slug: true, _count: { select: { dishes: true } } },
        take: 3,
      }),
    ]);

    const suggestions = [
      ...dishes.map((d) => ({
        type: "dish" as const,
        id: d.id,
        text: d.name,
        subtitle: d.category.name,
      })),
      ...cooks.map((c) => ({
        type: "cook" as const,
        id: c.id,
        text: c.name ?? "Cuisinier",
        subtitle: "Cuisinier",
      })),
      ...categories.map((c) => ({
        type: "category" as const,
        id: c.slug,
        text: c.name,
        subtitle: `${c._count.dishes} plats`,
      })),
    ];

    return NextResponse.json({ suggestions: suggestions.slice(0, 8) });
  } catch (error) {
    console.error("Suggestions error:", error);
    return NextResponse.json({ suggestions: [] });
  }
}
