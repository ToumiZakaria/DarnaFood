"use client";

import { useState } from "react";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import toast from "react-hot-toast";

import { useCartStore } from "@/store/cart";

type DishInfo = {
  id: string;
  name: string;
  price: number;
  cookId: string;
  cookName: string;
  image?: string;
};

export default function AddToCartButton({ dish, isCook }: { dish: DishInfo, isCook?: boolean }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCartStore();

  function handleAdd() {
    addItem({
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: qty,
      image: dish.image,
    }, dish.cookId);

    toast.success(`${qty}× ${dish.name} ajouté au panier !`, {
      icon: "🛒",
      duration: 3000,
    });
  }

  if (isCook) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      {/* Quantity Selector */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text-secondary)" }}>Quantité</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
          <button
            id="dish-qty-minus"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="btn btn-secondary btn-icon"
            style={{ width: 34, height: 34, borderRadius: "var(--radius-md)" }}
            aria-label="Diminuer la quantité"
          >
            <Minus size={14} />
          </button>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", minWidth: 28, textAlign: "center" }}>
            {qty}
          </span>
          <button
            id="dish-qty-plus"
            onClick={() => setQty((q) => q + 1)}
            className="btn btn-primary btn-icon"
            style={{ width: 34, height: 34, borderRadius: "var(--radius-md)" }}
            aria-label="Augmenter la quantité"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Total */}
      <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem", background: "var(--bg-secondary)", borderRadius: "var(--radius-md)" }}>
        <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>Total</span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "var(--primary-dark)", fontSize: "1.05rem" }}>
          {(dish.price * qty).toLocaleString("fr-DZ")} DA
        </span>
      </div>

      {/* Add to Cart */}
      <button
        id="dish-add-to-cart"
        onClick={handleAdd}
        className="btn btn-primary btn-lg"
        style={{ width: "100%", gap: "0.625rem" }}
      >
        <ShoppingBag size={18} />
        Ajouter au panier
      </button>
    </div>
  );
}
