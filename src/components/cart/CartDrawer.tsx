"use client";

import { useCartStore } from "@/store/cart";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, updateQuantity, clearCart } = useCartStore();
  const router = useRouter();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          zIndex: 200,
          backdropFilter: "blur(4px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "100%",
          maxWidth: 420,
          background: "var(--surface)",
          zIndex: 201,
          boxShadow: "var(--shadow-dropdown)",
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{
              width: 36, height: 36, borderRadius: "var(--radius-md)",
              background: "var(--primary-light)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <ShoppingBag size={18} color="var(--primary)" />
            </div>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
                Votre Panier
              </h2>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {items.length} article{items.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: "var(--radius-md)",
              border: "none", background: "var(--bg-secondary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--text-secondary)",
              transition: "all var(--transition-fast)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--error-bg)";
              (e.currentTarget as HTMLElement).style.color = "var(--error)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {items.length === 0 ? (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: "1rem",
              padding: "3rem 0",
            }}>
              <div style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "var(--bg-secondary)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ShoppingBag size={30} color="var(--text-muted)" />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "0.25rem" }}>
                  Votre panier est vide
                </p>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>
                  Ajoutez des plats pour commencer
                </p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.dishId}
                style={{
                  display: "flex",
                  gap: "0.875rem",
                  padding: "0.875rem",
                  background: "var(--bg)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--border)",
                  alignItems: "center",
                }}
              >
                {/* Image */}
                <div style={{
                  width: 60, height: 60, borderRadius: "var(--radius-md)",
                  overflow: "hidden", background: "var(--bg-secondary)",
                  flexShrink: 0, position: "relative",
                }}>
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                      🍽️
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontWeight: 600, fontSize: "0.875rem", color: "var(--text-primary)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {item.name}
                  </p>
                  <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)", marginTop: "2px" }}>
                    {(item.price * item.quantity).toLocaleString("fr-DZ")} DA
                  </p>
                </div>

                {/* Quantity */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "4px",
                }}>
                  <button
                    onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                    style={{
                      width: 28, height: 28, borderRadius: "var(--radius-sm)",
                      border: "none", background: "var(--bg-secondary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--border)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)")}
                  >
                    <Minus size={12} />
                  </button>
                  <span style={{ width: 24, textAlign: "center", fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                    style={{
                      width: 28, height: 28, borderRadius: "var(--radius-sm)",
                      border: "none", background: "var(--primary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all var(--transition-fast)",
                    }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--primary-dark)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "var(--primary)")}
                  >
                    <Plus size={12} color="white" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{
            padding: "1.25rem 1.5rem",
            borderTop: "1px solid var(--border)",
            background: "var(--bg)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            flexShrink: 0,
          }}>
            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600, color: "var(--text-secondary)", fontSize: "0.9375rem" }}>Total</span>
              <span style={{ fontWeight: 800, fontSize: "1.25rem", color: "var(--primary)" }}>
                {total.toLocaleString("fr-DZ")} DA
              </span>
            </div>

            {/* Buttons */}
            <button
              onClick={() => { onClose(); router.push("/checkout"); }}
              className="btn btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
            >
              Commander — {total.toLocaleString("fr-DZ")} DA
            </button>

            <button
              onClick={clearCart}
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "0.375rem", width: "100%",
                background: "none", border: "none",
                fontSize: "0.8125rem", color: "var(--text-muted)",
                cursor: "pointer", padding: "0.25rem",
                transition: "color var(--transition-fast)",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--error)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")}
            >
              <Trash2 size={13} /> Vider le panier
            </button>
          </div>
        )}
      </div>
    </>
  );
}
