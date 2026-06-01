"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BuyerSidebar from "@/components/dashboard/BuyerSidebar";
import {
  Heart, ShoppingCart, Trash2, Star, Clock, ChefHat
} from "lucide-react";

interface FavedDish {
  id: string;
  name: string;
  cook: string;
  cookId: string;
  city: string;
  price: number;
  rating: number;
  reviews: number;
  prepTime: number;
  image: string;
}

function loadFavs(): FavedDish[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("favorite_dishes");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function BuyerFavoritesPage() {
  const [favorites, setFavorites] = useState<FavedDish[]>([]);
  const { data: session } = useSession();

  useEffect(() => { setFavorites(loadFavs()); }, []);

  const removeFav = (id: string) => {
    const next = favorites.filter(d => d.id !== id);
    setFavorites(next);
    localStorage.setItem("favorite_dishes", JSON.stringify(next));
  };

  const userName = session?.user?.name ?? undefined;
  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? "U";

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "1.5rem 1rem", display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem", alignItems: "flex-start" }} className="buyer-grid">
        <BuyerSidebar userName={userName} userInitial={userInitial} />

        <div>
          <div style={{ marginBottom: "1.25rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.25rem" }}>
              <Heart size={20} style={{ display: "inline", color: "#EF4444", fill: "#EF4444", marginRight: "0.4rem", verticalAlign: "middle" }} />
              Mes favoris
            </h1>
            <p style={{ fontSize: "14px", color: "#64748B" }}>{favorites.length} plat{favorites.length > 1 ? "s" : ""} sauvegardé{favorites.length > 1 ? "s" : ""}</p>
          </div>

          {favorites.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                <Heart size={28} color="#EF4444" />
              </div>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "0.4rem" }}>Aucun favori pour l&apos;instant</h2>
              <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "1.25rem" }}>Explorez nos plats et ajoutez vos coups de cœur</p>
              <Link href="/dishes" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", height: 42, padding: "0 1.25rem", borderRadius: 10, background: "#F97316", color: "white", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
                <ChefHat size={15} /> Voir les plats
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }} className="favorites-grid">
              {favorites.map(dish => (
                <div key={dish.id} style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", transition: "all 300ms" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden", background: "#FAEEDA" }}>
                    <img src={dish.image} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button onClick={() => removeFav(dish.id)} style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} title="Retirer des favoris">
                      <Trash2 size={14} color="#EF4444" />
                    </button>
                  </div>

                  <div style={{ padding: "0.875rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.375rem" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#F97316", color: "white", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{dish.cook[0]}</div>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{dish.cook}</span>
                      <span style={{ fontSize: "11px", color: "#94A3B8", flexShrink: 0 }}>· {dish.city}</span>
                    </div>
                    <Link href={`/dishes/${dish.id}`} style={{ textDecoration: "none" }}>
                      <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", lineHeight: 1.3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "0.5rem" }}>{dish.name}</h3>
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "11px", color: "#94A3B8", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}><Clock size={10} /> {dish.prepTime} min</span>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 2, color: "#F97316" }}><Star size={10} fill="#F97316" /> {dish.rating}</span>
                      <span>({dish.reviews} avis)</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ minWidth: 0 }}>
                        <span style={{ fontSize: "17px", fontWeight: 800, color: "#F97316" }}>{dish.price}</span>
                        <span style={{ fontSize: "11px", color: "#94A3B8", marginLeft: 2 }}>DA</span>
                      </div>
                      <Link href={`/dishes/${dish.id}`} style={{ height: 32, padding: "0 0.75rem", borderRadius: 9999, background: "#F97316", color: "white", border: "none", fontSize: "11px", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                        <ShoppingCart size={12} /> Commander
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .buyer-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 480px) { .favorites-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
