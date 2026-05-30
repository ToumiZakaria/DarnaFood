"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight, ShieldCheck, Tag } from "lucide-react";
import { useCartStore } from "@/store/cart";

const DELIVERY_FEE = 100;

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const cookId = useCartStore(state => state.cookId);
  const cookNameStored = useCartStore(state => state.cookName);
  const [promo, setPromo] = useState("");

  const cookName = cookNameStored || "";
  const cookCity = "";

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveries = cookId ? DELIVERY_FEE : 0;
  const total = subtotal + deliveries;

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>
          Mon panier
        </h1>
        <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "2rem" }}>
          {items.length > 0 ? `${items.reduce((s, i) => s + i.quantity, 0)} articles` : "Votre panier est vide"}
        </p>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <ShoppingCart size={36} color="#F97316" />
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "0.75rem" }}>Votre panier est vide</h2>
            <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "1.5rem" }}>Explorez nos plats et ajoutez vos favoris</p>
            <Link href="/dishes" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", height: 48, padding: "0 1.5rem", borderRadius: 12, background: "#F97316", color: "white", textDecoration: "none", fontSize: "15px", fontWeight: 600 }}>
              Voir les plats <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "flex-start" }} className="cart-grid">

            {/* ── Cart Items ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {cookId && (
                <div>
                  {/* Cook header */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "13px", fontWeight: 700 }}>
                      {cookName[0]}
                    </div>
                    <div>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: "#0F172A" }}>{cookName}</span>
                      <span style={{ fontSize: "13px", color: "#94A3B8" }}> · {cookCity}</span>
                    </div>
                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "12px", fontWeight: 600, color: "#0D9488", background: "#F0FDFA", padding: "0.25rem 0.625rem", borderRadius: 9999 }}>
                      Vérifié
                    </div>
                  </div>

                  {/* Items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {items.map(item => (
                      <div key={item.dishId} style={{ background: "white", borderRadius: 20, padding: "1.25rem", display: "flex", gap: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
                        <div style={{ width: 90, height: 90, borderRadius: 12, overflow: "hidden", flexShrink: 0, background: "#FAEEDA" }}>
                          {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</h3>
                          <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "0.625rem" }}>par portion</p>
                          <span style={{ fontSize: "14px", fontWeight: 600, color: "#F97316" }}>{item.price.toLocaleString("fr-DZ")} DA</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "space-between" }}>
                          <button onClick={() => removeItem(item.dishId)} style={{ width: 30, height: 30, borderRadius: 8, background: "transparent", border: "none", color: "#CBD5E1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "color 150ms" }}
                            onMouseEnter={e => (e.currentTarget.style.color = "#EF4444")}
                            onMouseLeave={e => (e.currentTarget.style.color = "#CBD5E1")}
                          >
                            <Trash2 size={16} />
                          </button>
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                              <button onClick={() => updateQuantity(item.dishId, item.quantity - 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid #E2E8F0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Minus size={14} /></button>
                              <span style={{ width: 28, textAlign: "center", fontWeight: 700, fontSize: "15px", color: "#0F172A" }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.dishId, item.quantity + 1)} style={{ width: 32, height: 32, borderRadius: 8, border: "none", background: "#F97316", color: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Plus size={14} /></button>
                            </div>
                            <p style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", textAlign: "right" }}>{(item.price * item.quantity).toLocaleString("fr-DZ")} DA</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── Order Summary ── */}
            <div style={{ position: "sticky", top: "calc(72px + 1.5rem)" }}>
              <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #F1F5F9" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "1.5rem" }}>Récapitulatif</h2>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#64748B" }}>Sous-total</span>
                    <span style={{ fontWeight: 600, color: "#0F172A" }}>{subtotal.toLocaleString("fr-DZ")} DA</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#64748B" }}>Livraison</span>
                    <span style={{ fontWeight: 600, color: "#0F172A" }}>{deliveries.toLocaleString("fr-DZ")} DA</span>
                  </div>
                </div>

                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "1rem", marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>Total</span>
                    <span style={{ fontSize: "24px", fontWeight: 800, color: "#F97316" }}>{total.toLocaleString("fr-DZ")} DA</span>
                  </div>
                </div>

                {/* Promo code */}
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "0.5rem", background: "#F8FAFC", borderRadius: 12, padding: "0 0.875rem", border: "1.5px solid #E2E8F0" }}>
                    <Tag size={15} color="#94A3B8" />
                    <input value={promo} onChange={e => setPromo(e.target.value)} placeholder="Code promo" style={{ flex: 1, height: 42, background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "#0F172A" }} />
                  </div>
                  <button style={{ height: 42, padding: "0 1rem", borderRadius: 12, border: "1.5px solid #F97316", background: "transparent", color: "#F97316", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
                    Appliquer
                  </button>
                </div>

                <Link href="/checkout" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.5rem", height: 56, borderRadius: 14, background: "#F97316", color: "white", textDecoration: "none", fontSize: "16px", fontWeight: 700, transition: "background 150ms", marginBottom: "1rem" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#EA580C")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#F97316")}
                >
                  Passer la commande <ArrowRight size={18} />
                </Link>

                <p style={{ textAlign: "center", fontSize: "13px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
                  <ShieldCheck size={14} color="#0D9488" /> Paiement sécurisé · Remboursement garanti
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
