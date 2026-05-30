"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Heart, ShoppingCart, Trash2, Star, Clock, LayoutDashboard,
  ShoppingBag, User, Settings, ChefHat
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

const sideLinks = [
  { href: "/dashboard/buyer", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/buyer/orders", label: "Mes commandes", icon: ShoppingBag },
  { href: "/dashboard/buyer/favorites", label: "Favoris", icon: Heart },
  { href: "/dashboard/buyer/profile", label: "Mon profil", icon: User },
  { href: "/dashboard/buyer/settings", label: "Paramètres", icon: Settings },
];

function loadFavs(): FavedDish[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("favorite_dishes");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export default function BuyerFavoritesPage() {
  const [favorites, setFavorites] = useState<FavedDish[]>([]);

  useEffect(() => {
    setFavorites(loadFavs());
  }, []);

  const removeFav = (id: string) => {
    const next = favorites.filter(d => d.id !== id);
    setFavorites(next);
    localStorage.setItem("favorite_dishes", JSON.stringify(next));
  };

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "240px 1fr", gap: "2rem", alignItems: "flex-start" }} className="buyer-grid">

        {/* Sidebar */}
        <aside style={{ background: "white", borderRadius: 20, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", position: "sticky", top: "calc(72px + 1.5rem)" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {sideLinks.map(link => (
              <Link key={link.href} href={link.href}
                style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.875rem", borderRadius: 12, fontSize: "14px", fontWeight: 500, color: link.href === "/dashboard/buyer/favorites" ? "#F97316" : "#475569", background: link.href === "/dashboard/buyer/favorites" ? "#FFF7ED" : "transparent", textDecoration: "none", transition: "all 150ms" }}>
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div>
          <div style={{ marginBottom: "1.5rem" }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.375rem" }}>
              <Heart size={24} style={{ display: "inline", color: "#EF4444", fill: "#EF4444", marginRight: "0.5rem" }} />
              Mes favoris
            </h1>
            <p style={{ fontSize: "15px", color: "#64748B" }}>{favorites.length} plat{favorites.length > 1 ? "s" : ""} sauvegardé{favorites.length > 1 ? "s" : ""}</p>
          </div>

          {favorites.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 0" }}>
              <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
                <Heart size={32} color="#EF4444" />
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>Aucun favori pour l&apos;instant</h2>
              <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "1.5rem" }}>Explorez nos plats et ajoutez vos coups de cœur</p>
              <Link href="/dishes" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", height: 46, padding: "0 1.5rem", borderRadius: 12, background: "#F97316", color: "white", textDecoration: "none", fontSize: "15px", fontWeight: 600 }}>
                <ChefHat size={16} /> Voir les plats
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
              {favorites.map(dish => (
                <div key={dish.id} style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", transition: "all 300ms" }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.09)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  {/* Image */}
                  <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden", background: "#FAEEDA" }}>
                    <img src={dish.image} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button onClick={() => removeFav(dish.id)} style={{ position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 150ms" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.95)"; }}
                      title="Retirer des favoris"
                    >
                      <Trash2 size={15} color="#EF4444" />
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
                      <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#F97316" }}><Star size={11} fill="#F97316" /> {dish.rating}</span>
                      <span>({dish.reviews} avis)</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: "20px", fontWeight: 800, color: "#F97316" }}>{dish.price}</span>
                        <span style={{ fontSize: "13px", color: "#94A3B8", marginLeft: 3 }}>DA</span>
                      </div>
                      <Link href={`/dishes/${dish.id}`} style={{ height: 34, padding: "0 0.875rem", borderRadius: 9999, background: "#F97316", color: "white", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                        <ShoppingCart size={13} /> Commander
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
        @media (max-width: 900px) {
          .buyer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
