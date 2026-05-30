"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Clock, Heart, LayoutGrid, List, UtensilsCrossed, ArrowLeft, ArrowRight } from "lucide-react";

interface Dish {
  id: string;
  name: string;
  cook: string;
  cookId: string;
  city: string;
  rating: number;
  reviews: number;
  price: number;
  prepTime: number;
  badge: string | null;
  category: string;
  image: string | null;
}

export default function DishesClient({ dishes }: { dishes: Dish[] }) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;
  const total = dishes.length;
  const pages = Math.ceil(total / PER_PAGE);
  const pageDishes = dishes.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const toggleFav = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  if (dishes.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "6rem 0" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
          <UtensilsCrossed size={36} color="#F97316" />
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "0.75rem" }}>Aucun plat trouvé</h2>
        <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "1.5rem" }}>Essayez de modifier vos filtres ou recherchez autre chose</p>
        <Link href="/dishes" style={{ display: "inline-flex", alignItems: "center", height: 44, padding: "0 1.5rem", borderRadius: 12, border: "2px solid #F97316", color: "#F97316", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
          Réinitialiser les filtres
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Results header + view toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "14px", color: "#64748B" }}>{total} plats trouvés</p>
        <div style={{ display: "flex", gap: "0.25rem", background: "white", padding: "0.25rem", borderRadius: 10, border: "1px solid #E2E8F0" }}>
          {[{ mode: "grid" as const, icon: LayoutGrid }, { mode: "list" as const, icon: List }].map(({ mode, icon: Icon }) => (
            <button key={mode} onClick={() => setViewMode(mode)} style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: viewMode === mode ? "#F97316" : "transparent", color: viewMode === mode ? "white" : "#64748B", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 150ms" }}>
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: viewMode === "grid" ? "repeat(auto-fill, minmax(260px, 1fr))" : "1fr", gap: "1.25rem" }}>
        {pageDishes.map(dish => (
          viewMode === "grid" ? (
            <div key={dish.id} style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", transition: "all 300ms" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              {/* Image */}
              <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden", background: "#FAEEDA" }}>
                {dish.image ? (
                  <img src={dish.image} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🍽️</div>
                )}
                {dish.badge && (
                  <span style={{ position: "absolute", top: 10, left: 10, background: dish.badge === "Populaire" ? "#EF4444" : "#F97316", color: "white", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: 9999 }}>{dish.badge}</span>
                )}
                <button onClick={() => toggleFav(dish.id)} style={{ position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "18px", transition: "transform 150ms" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.1)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                >
                  <Heart size={16} fill={favorites.has(dish.id) ? "#F97316" : "none"} color={favorites.has(dish.id) ? "#F97316" : "#94A3B8"} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: "1.125rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#F97316", color: "white", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{dish.cook[0]}</div>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "#475569" }}>{dish.cook}</span>
                  <span style={{ fontSize: "12px", color: "#94A3B8" }}>· {dish.city}</span>
                </div>
                <Link href={`/dishes/${dish.id}`} style={{ textDecoration: "none" }}>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "0.625rem" }}>{dish.name}</h3>
                </Link>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "12px", color: "#94A3B8", marginBottom: "0.875rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} /> {dish.prepTime} min</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#F97316" }}><Star size={11} fill="#F97316" /> {dish.rating > 0 ? dish.rating.toFixed(1) : "—"}</span>
                  {dish.reviews > 0 && <span>({dish.reviews})</span>}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "20px", fontWeight: 800, color: "#F97316" }}>{dish.price}</span>
                    <span style={{ fontSize: "13px", color: "#94A3B8", marginLeft: 3 }}>DA</span>
                  </div>
                  <Link href={`/dishes/${dish.id}`} style={{ height: 34, padding: "0 0.875rem", borderRadius: 9999, background: "#F97316", color: "white", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", transition: "background 150ms" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#EA580C")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#F97316")}
                  >
                    Voir
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* List view */
            <Link key={dish.id} href={`/dishes/${dish.id}`} style={{ textDecoration: "none", display: "flex", background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", transition: "all 200ms", gap: 0 }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
            >
              <div style={{ width: 120, height: 100, flexShrink: 0, background: "#FAEEDA", overflow: "hidden" }}>
                {dish.image && <img src={dish.image} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
              </div>
              <div style={{ padding: "1rem", flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                <div>
                  <p style={{ fontSize: "12px", color: "#94A3B8", marginBottom: 4 }}>{dish.cook} · {dish.city}</p>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{dish.name}</h3>
                  <div style={{ display: "flex", gap: "1rem", fontSize: "12px", color: "#94A3B8" }}>
                    <span><Clock size={11} style={{ display: "inline", marginRight: 3 }} />{dish.prepTime} min</span>
                    {dish.rating > 0 && <span style={{ color: "#F97316" }}><Star size={11} fill="#F97316" style={{ display: "inline", marginRight: 3 }} />{dish.rating.toFixed(1)}</span>}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#F97316" }}>{dish.price} DA</div>
                </div>
              </div>
            </Link>
          )
        ))}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", marginTop: "3rem" }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ height: 40, padding: "0 1rem", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "white", color: page === 1 ? "#CBD5E1" : "#475569", cursor: page === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "14px", fontWeight: 500 }}>
            <ArrowLeft size={14} /> Précédent
          </button>
          {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ width: 40, height: 40, borderRadius: 10, background: page === p ? "#F97316" : "white", color: page === p ? "white" : "#475569", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: page === p ? "none" : "0 1px 3px rgba(0,0,0,0.05)", border: page === p ? "none" : "1.5px solid #E2E8F0" }}>
              {p}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ height: 40, padding: "0 1rem", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "white", color: page === pages ? "#CBD5E1" : "#475569", cursor: page === pages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: "14px", fontWeight: 500 }}>
            Suivant <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
