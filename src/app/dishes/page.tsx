import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Search, Star, Clock, SlidersHorizontal, LayoutGrid, List, X, ChevronDown, UtensilsCrossed, Wheat, Flame, CookingPot, Coffee, Leaf, PartyPopper } from "lucide-react";
import DishesClient from "@/app/dishes/DishesClient";

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
  searchParams: Promise<{ q?: string; category?: string; city?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const { q, category, city, sort } = params;

  // Fetch real dishes from DB
  let dishes: any[] = [];
  try {
    const dbDishes = await prisma.dish.findMany({
      where: {
        isAvailable: true,
        ...(q && { name: { contains: q, mode: "insensitive" } }),
        ...(category && { category: { slug: category } }),
        ...(city && { cook: { cookProfile: { wilaya: city } } }),
      },
      include: {
        cook: { select: { id: true, name: true, cookProfile: { select: { wilaya: true, avgRating: true } } } },
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true, icon: true } },
      },
      orderBy: sort === "price_asc" ? { price: "asc" } : sort === "price_desc" ? { price: "desc" } : { createdAt: "desc" },
      take: 48,
    });
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
    ...(city ? [city] : []),
    ...(category ? [category] : []),
    ...(q ? [`"${q}"`] : []),
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
          <p style={{ fontSize: "16px", color: "#475569" }}>
            {dishes.length} plats disponibles{city ? ` à ${city}` : " près de chez vous"}
          </p>
        </div>
      </div>

      {/* ── Sticky Filter Bar ── */}
      <div style={{ position: "sticky", top: 72, zIndex: 40, background: "white", borderBottom: "1px solid #E2E8F0", padding: "0.75rem 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", gap: "1rem", overflowX: "auto" }} className="scrollbar-hide">
          {/* Category chips */}
          <div style={{ display: "flex", gap: "0.5rem", flex: 1, overflowX: "auto" }} className="scrollbar-hide">
            {CATEGORIES.map(cat => {
              const isActive = category === cat.slug || (!category && !cat.slug);
              return (
                <Link
                  key={cat.label}
                  href={cat.slug ? `/dishes?category=${cat.slug}${q ? `&q=${q}` : ""}` : `/dishes${q ? `?q=${q}` : ""}`}
                  style={{ height: 36, padding: "0 0.875rem", borderRadius: 9999, border: "1.5px solid", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "13px", fontWeight: 600, textDecoration: "none", transition: "all 150ms", flexShrink: 0, background: isActive ? "#F97316" : "white", color: isActive ? "white" : "#475569", borderColor: isActive ? "#F97316" : "#E2E8F0" }}
                >
                  <cat.icon size={14} />
                  {cat.label}
                </Link>
              );
            })}
          </div>

          {/* Right filters */}
          <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
            {["Ville", "Prix", "Note"].map(f => (
              <button key={f} style={{ height: 36, padding: "0 0.875rem", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "white", fontSize: "13px", fontWeight: 500, color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem", whiteSpace: "nowrap" }}>
                {f} <ChevronDown size={13} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active Filters ── */}
      {activeFilters.length > 0 && (
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0.75rem 1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
          {activeFilters.map(f => (
            <span key={f} style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "#FFF7ED", color: "#EA580C", padding: "0.25rem 0.75rem", borderRadius: 9999, fontSize: "13px", fontWeight: 500 }}>
              {f} <X size={12} style={{ cursor: "pointer" }} />
            </span>
          ))}
          <Link href="/dishes" style={{ fontSize: "13px", color: "#94A3B8", textDecoration: "none", marginLeft: "0.25rem" }}>Effacer tout</Link>
        </div>
      )}

      {/* ── Results Grid ── */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <DishesClient dishes={dishes} />
      </div>

      <style>{`
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
