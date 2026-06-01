import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { UtensilsCrossed, Wheat, Flame, CookingPot, Coffee, Leaf, PartyPopper } from "lucide-react";
import DishesClient from "@/app/dishes/DishesClient";
import DishesSearchControls from "./DishesSearchControls";

export const metadata: Metadata = {
  title: "Tous les plats",
  description: "Parcourez des centaines de plats faits maison préparés par des cuisiniers locaux algériens.",
};

const CATEGORIES = [
  { label: "Tous", slug: null, icon: UtensilsCrossed },
  { label: "Couscous", slug: "couscous", icon: Wheat },
  { label: "Chorba", slug: "chorba", icon: Flame },
  { label: "Tajine", slug: "tajine", icon: CookingPot },
  { label: "Pâtisserie", slug: "patisserie", icon: Coffee },
  { label: "Salades", slug: "salades", icon: Leaf },
  { label: "Grillades", slug: "grillades", icon: Flame },
  { label: "Plats de fête", slug: "plats-de-fete", icon: PartyPopper },
];

export default async function DishesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; city?: string; wilaya?: string; minPrice?: string; maxPrice?: string; minRating?: string; sortBy?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { q, category, city, wilaya, minPrice, maxPrice, minRating, sortBy } = params;
  const pageNum = Math.max(1, parseInt(params.page || "1"));

  let dishes: any[] = [];
  let totalCount = 0;
  try {
    const where: any = { isAvailable: true };

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { cook: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (city || wilaya) {
      where.cook = {
        ...(city ? { cookProfile: { wilaya: { contains: city, mode: "insensitive" } } } : {}),
        ...(wilaya ? { cookProfile: { wilaya: { contains: wilaya, mode: "insensitive" } } } : {}),
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minRating) {
      where.cook = { ...where.cook, cookProfile: { ...where.cook?.cookProfile, avgRating: { gte: parseFloat(minRating) } } };
    }

    const orderBy: any = (() => {
      switch (sortBy) {
        case "price_asc": return { price: "asc" as const };
        case "price_desc": return { price: "desc" as const };
        case "rating": return { rating: "desc" as const };
        case "popular": return { orderCount: "desc" as const };
        default: return { createdAt: "desc" as const };
      }
    })();

    const limit = 12;
    const [dbDishes, count] = await Promise.all([
      prisma.dish.findMany({
        where,
        include: {
          cook: { select: { id: true, name: true, cookProfile: { select: { wilaya: true, avgRating: true } } } },
          images: { where: { isPrimary: true }, take: 1 },
          category: { select: { name: true, icon: true } },
        },
        orderBy,
        skip: (pageNum - 1) * limit,
        take: limit,
      }),
      prisma.dish.count({ where }),
    ]);
    totalCount = count;
    dishes = dbDishes.map(d => ({
      id: d.id,
      name: d.name,
      cook: d.cook.name ?? "Cuisinier",
      cookId: d.cook.id,
      city: d.cook.cookProfile?.wilaya ?? "Relizane",
      rating: d.cook.cookProfile?.avgRating ?? 0,
      reviews: 0,
      price: d.price,
      prepTime: d.prepTime,
      badge: null,
      category: d.category.name,
      image: d.images[0]?.url ?? null,
    }));
  } catch {}

  const activeFilters = [
    ...(city ? [{ key: "city", label: city }] : []),
    ...(wilaya ? [{ key: "wilaya", label: wilaya }] : []),
    ...(category ? [{ key: "category", label: category }] : []),
    ...(q ? [{ key: "q", label: `"${q}"` }] : []),
    ...(minPrice ? [{ key: "minPrice", label: `Min ${minPrice} DA` }] : []),
    ...(maxPrice ? [{ key: "maxPrice", label: `Max ${maxPrice} DA` }] : []),
    ...(minRating ? [{ key: "minRating", label: `${minRating}+ ⭐` }] : []),
  ];

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      {/* ── Page Header ── */}
      <div style={{ background: "#FAEEDA", padding: "3rem 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem" }}>
          <nav style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "1rem" }}>
            <Link href="/" style={{ color: "#94A3B8", textDecoration: "none" }}>Accueil</Link>
            <span style={{ margin: "0 0.5rem" }}>›</span>
            <span style={{ color: "#475569", fontWeight: 500 }}>Plats</span>
          </nav>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 2.5rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>
            Tous les plats
          </h1>
          <p style={{ fontSize: "16px", color: "#475569", marginBottom: "1.5rem" }}>
            {totalCount} plats disponibles{city ? ` à ${city}` : wilaya ? ` à ${wilaya}` : " près de chez vous"}
          </p>
          <DishesSearchControls />
        </div>
      </div>

      {/* ── Sticky Filter Bar ── */}
      <DishesSearchFilters
        category={category || null}
        q={q || null}
        CATEGORIES={CATEGORIES}
      />

      {/* ── Active Filters ── */}
      {activeFilters.length > 0 && (
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0.75rem 1.5rem 0", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {activeFilters.map(f => {
            const newParams = new URLSearchParams({ ...params, [f.key]: "" });
            if (!newParams.get(f.key)) newParams.delete(f.key);
            const href = `/dishes?${newParams.toString()}`;
            return (
              <Link key={f.key} href={href} style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", background: "#FFF7ED", color: "#EA580C", padding: "0.25rem 0.75rem", borderRadius: 9999, fontSize: "13px", fontWeight: 500, textDecoration: "none" }}>
                {f.label} ✕
              </Link>
            );
          })}
          <Link href="/dishes" style={{ fontSize: "13px", color: "#94A3B8", textDecoration: "none", marginLeft: "0.25rem" }}>Effacer tout</Link>
        </div>
      )}

      {/* ── Results Grid ── */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <DishesClient dishes={dishes} totalCount={totalCount} currentPage={pageNum} />
      </div>

      <style>{`
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function DishesSearchFilters({ category, q, CATEGORIES }: { category: string | null; q: string | null; CATEGORIES: { label: string; slug: string | null; icon: React.ComponentType<any> }[] }) {
  return (
    <div style={{ position: "sticky", top: 72, zIndex: 40, background: "white", borderBottom: "1px solid #E2E8F0", padding: "0.75rem 0" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", gap: "1rem", overflowX: "auto" }} className="scrollbar-hide">
        <div style={{ display: "flex", gap: "0.5rem", flex: 1, overflowX: "auto" }} className="scrollbar-hide">
          {CATEGORIES.map(cat => {
            const isActive = category === cat.slug || (!category && !cat.slug);
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={cat.slug ? `/dishes?category=${cat.slug}${q ? `&q=${q}` : ""}` : `/dishes${q ? `?q=${q}` : ""}`}
                style={{ height: 36, padding: "0 0.875rem", borderRadius: 9999, border: "1.5px solid", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "all 150ms", flexShrink: 0, background: isActive ? "#F97316" : "white", color: isActive ? "white" : "#475569", borderColor: isActive ? "#F97316" : "#E2E8F0" }}
              >
                <Icon size={14} />
                {cat.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
