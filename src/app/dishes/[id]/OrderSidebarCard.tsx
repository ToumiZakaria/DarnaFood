"use client";

import { useState, useEffect } from "react";
import { Bike, Store, ShoppingBag, Heart, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/cart";

interface DishInfo {
  id: string;
  name: string;
  price: number;
  cookId: string;
  cookName: string;
  image?: string;
  isAvailable: boolean;
}

interface OrderSidebarCardProps {
  dish: DishInfo;
  isCook: boolean;
}

export default function OrderSidebarCard({ dish, isCook }: OrderSidebarCardProps) {
  const { addItem } = useCartStore();
  const [qty, setQty] = useState(1);
  const [mode, setMode] = useState<"delivery" | "pickup">("delivery");
  const [isFavorite, setIsFavorite] = useState(false);

  // Load favorite state from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFavsStr = localStorage.getItem("buyer_favorites");
      if (storedFavsStr) {
        try {
          const storedFavs: string[] = JSON.parse(storedFavsStr);
          setIsFavorite(storedFavs.includes(dish.id));
        } catch (e) {}
      }
    }
  }, [dish.id]);

  const toggleFavorite = () => {
    if (isCook) {
      toast.error("Les cuisiniers ne peuvent pas ajouter de plats aux favoris");
      return;
    }

    if (typeof window !== "undefined") {
      const storedFavsStr = localStorage.getItem("buyer_favorites");
      let storedFavs: string[] = [];
      if (storedFavsStr) {
        try {
          storedFavs = JSON.parse(storedFavsStr);
        } catch (e) {}
      }

      if (isFavorite) {
        storedFavs = storedFavs.filter(id => id !== dish.id);
        setIsFavorite(false);
        toast.success("Retiré des favoris !");
      } else {
        storedFavs.push(dish.id);
        setIsFavorite(true);
        toast.success("Ajouté aux favoris !");
      }

      localStorage.setItem("buyer_favorites", JSON.stringify(storedFavs));
    }
  };

  const handleAdd = () => {
    if (isCook) {
      toast.error("Les cuisiniers ne peuvent pas commander de plats");
      return;
    }

    addItem({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: qty,
      image: dish.image,
    }, dish.cookId, dish.cookName);

    toast.success(`${qty}× ${dish.name} ajouté au panier !`, {
      icon: "🛒",
      duration: 3000,
    });
  };

  return (
    <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 8px 30px rgba(0,0,0,0.10)", border: "1px solid #F1F5F9" }}>
      {/* Price */}
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "0.375rem" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "2.25rem", fontWeight: 900, color: "#F97316", lineHeight: 1 }}>
            {dish.price.toLocaleString("fr-DZ")}
          </span>
          <span style={{ fontSize: "1rem", fontWeight: 500, color: "#94A3B8", marginBottom: 6 }}>DA / portion</span>
        </div>
        {dish.isAvailable ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22C55E" }} />
            <span style={{ fontSize: "14px", fontWeight: 500, color: "#22C55E" }}>Disponible aujourd&apos;hui</span>
          </div>
        ) : (
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#94A3B8", marginTop: "0.5rem" }}>Indisponible actuellement</div>
        )}
      </div>

      {/* Delivery toggle */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
        {[
          { key: "delivery" as const, icon: Bike, label: "Livraison", sub: "~45 min · 100 DA" },
          { key: "pickup" as const, icon: Store, label: "Retrait", sub: "Chez cuisinier · Gratuit" },
        ].map(opt => {
          const Icon = opt.icon;
          const isSelected = mode === opt.key;
          return (
            <div
              key={opt.key}
              onClick={() => setMode(opt.key)}
              style={{
                padding: "0.875rem",
                borderRadius: 12,
                border: `2px solid ${isSelected ? "#F97316" : "#E2E8F0"}`,
                background: isSelected ? "#FFF7ED" : "white",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 150ms ease"
              }}
            >
              <Icon size={18} color={isSelected ? "#F97316" : "#94A3B8"} style={{ margin: "0 auto 0.375rem" }} />
              <div style={{ fontSize: "13px", fontWeight: 700, color: isSelected ? "#0F172A" : "#94A3B8" }}>{opt.label}</div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: 2 }}>{opt.sub}</div>
            </div>
          );
        })}
      </div>

      {/* Quantity Selector */}
      {dish.isAvailable && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#64748B" }}>Quantité</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              style={{ width: 34, height: 34, borderRadius: 8, border: "1.5px solid #E2E8F0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              aria-label="Diminuer la quantité"
            >
              <Minus size={14} />
            </button>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "#0F172A", minWidth: 28, textAlign: "center" }}>
              {qty}
            </span>
            <button
              onClick={() => setQty((q) => q + 1)}
              style={{ width: 34, height: 34, borderRadius: 8, border: "none", background: "#F97316", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              aria-label="Augmenter la quantité"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Total */}
      {dish.isAvailable && (
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem", background: "#F8FAFC", borderRadius: 10, marginBottom: "1.25rem" }}>
          <span style={{ fontSize: "0.875rem", color: "#64748B" }}>Total</span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#EA580C", fontSize: "1.05rem" }}>
            {(dish.price * qty + (mode === "delivery" ? 100 : 0)).toLocaleString("fr-DZ")} DA
          </span>
        </div>
      )}

      {/* Add to Cart */}
      {dish.isAvailable ? (
        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            height: 56,
            borderRadius: 14,
            background: "#F97316",
            color: "white",
            border: "none",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.625rem",
            transition: "background 150ms ease"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#EA580C"}
          onMouseLeave={e => e.currentTarget.style.background = "#F97316"}
        >
          <ShoppingBag size={18} />
          Ajouter au panier
        </button>
      ) : (
        <button disabled style={{ width: "100%", height: 56, borderRadius: 14, background: "#F1F5F9", color: "#94A3B8", border: "none", fontSize: "15px", fontWeight: 600, cursor: "not-allowed" }}>
          Indisponible actuellement
        </button>
      )}

      {/* Favorites */}
      {!isCook && (
        <button
          onClick={toggleFavorite}
          style={{
            width: "100%",
            height: 48,
            borderRadius: 14,
            border: `2px solid ${isFavorite ? "#EF4444" : "#0D9488"}`,
            background: isFavorite ? "#FEF2F2" : "transparent",
            color: isFavorite ? "#EF4444" : "#0D9488",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "0.75rem",
            transition: "all 150ms"
          }}
        >
          <Heart size={16} fill={isFavorite ? "#EF4444" : "none"} />
          {isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
        </button>
      )}

      {/* Trust signals */}
      <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem", borderTop: "1px solid #F1F5F9", paddingTop: "1.25rem" }}>
        {[
          { icon: "🔒", text: "Paiement 100% sécurisé" },
          { icon: "🔄", text: "Remboursement si problème" },
          { icon: "✓", text: "Cuisinier vérifié" },
        ].map(t => (
          <div key={t.text} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "13px", color: "#64748B" }}>
            <span>{t.icon}</span> {t.text}
          </div>
        ))}
      </div>
    </div>
  );
}
