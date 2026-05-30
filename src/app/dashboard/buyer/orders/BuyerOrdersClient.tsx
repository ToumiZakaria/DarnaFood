"use client";

import Link from "next/link";
import { useState } from "react";
import ContactButton from "@/components/chat/ContactButton";
import {
  ShoppingBag, Star, ChevronRight, Search, Filter,
  CheckCircle, Clock, Truck, XCircle, RotateCcw, Home,
  LayoutDashboard, Heart, User, Settings
} from "lucide-react";

const sideLinks = [
  { href: "/dashboard/buyer", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/buyer/orders", label: "Mes commandes", icon: ShoppingBag },
  { href: "/dashboard/buyer/favorites", label: "Favoris", icon: Heart },
  { href: "/dashboard/buyer/profile", label: "Mon profil", icon: User },
  { href: "/dashboard/buyer/settings", label: "Paramètres", icon: Settings },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:    { label: "En attente",    color: "#F59E0B", bg: "#FFFBEB", icon: Clock },
  CONFIRMED:  { label: "Confirmée",     color: "#3B82F6", bg: "#EFF6FF", icon: CheckCircle },
  PREPARING:  { label: "En préparation",color: "#8B5CF6", bg: "#F5F3FF", icon: Clock },
  READY:      { label: "Prête",         color: "#A855F7", bg: "#FAF5FF", icon: CheckCircle },
  DELIVERING: { label: "En route",      color: "#0D9488", bg: "#F0FDFA", icon: Truck },
  COMPLETED:  { label: "Livrée",        color: "#22C55E", bg: "#F0FDF4", icon: CheckCircle },
  CANCELLED:  { label: "Annulée",       color: "#EF4444", bg: "#FEF2F2", icon: XCircle },
};

const FILTER_TABS = [
  { key: "all", label: "Toutes" },
  { key: "active", label: "En cours" },
  { key: "COMPLETED", label: "Livrées" },
  { key: "CANCELLED", label: "Annulées" },
];

interface OrderItem {
  dish: {
    name: string;
  };
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  cook: {
    id: string;
    name: string | null;
  };
  items: OrderItem[];
}

interface BuyerOrdersClientProps {
  initialOrders: Order[];
}

export default function BuyerOrdersClient({ initialOrders }: BuyerOrdersClientProps) {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");

  const formattedOrders = initialOrders.map(order => {
    const dishNames = order.items.map(i => `${i.dish?.name || "Plat"} × ${i.quantity}`);
    const dateStr = new Date(order.createdAt).toLocaleDateString("fr-DZ", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });

    return {
      id: order.id,
      items: dishNames,
      cook: order.cook?.name || "Cuisinier",
      cookId: order.cook?.id || "",
      date: dateStr,
      total: order.totalAmount,
      status: order.status,
    };
  });

  const filtered = formattedOrders.filter(o => {
    if (tab === "active") return ["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERING"].includes(o.status);
    if (tab === "COMPLETED") return o.status === "COMPLETED";
    if (tab === "CANCELLED") return o.status === "CANCELLED";
    return true;
  }).filter(o =>
    q === "" || o.id.toLowerCase().includes(q.toLowerCase()) || o.cook.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "240px 1fr", gap: "2rem", alignItems: "flex-start" }} className="buyer-grid">

        {/* ── Sidebar ── */}
        <aside style={{ background: "white", borderRadius: 20, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", position: "sticky", top: "calc(72px + 1.5rem)" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {sideLinks.map(link => (
              <Link key={link.href} href={link.href}
                style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.875rem", borderRadius: 12, fontSize: "14px", fontWeight: 500, color: link.href === "/dashboard/buyer/orders" ? "#F97316" : "#475569", background: link.href === "/dashboard/buyer/orders" ? "#FFF7ED" : "transparent", textDecoration: "none", transition: "all 150ms" }}>
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* ── Main ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.375rem" }}>Mes commandes</h1>
            <p style={{ fontSize: "15px", color: "#64748B" }}>{initialOrders.length} commande{initialOrders.length > 1 ? "s" : ""} au total</p>
          </div>

          {/* Filter + search bar */}
          <div style={{ background: "white", borderRadius: 16, padding: "1rem 1.25rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", gap: "0.375rem", flex: 1 }}>
              {FILTER_TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{ height: 34, padding: "0 0.875rem", borderRadius: 9999, border: "none", background: tab === t.key ? "#F97316" : "#F1F5F9", color: tab === t.key ? "white" : "#64748B", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 150ms", whiteSpace: "nowrap" }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#F8FAFC", borderRadius: 10, padding: "0 0.75rem", border: "1.5px solid #E2E8F0", height: 36 }}>
              <Search size={15} color="#94A3B8" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Chercher une commande…" style={{ background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "#0F172A", width: 180 }} />
            </div>
          </div>

          {/* Orders list */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "4rem 0" }}>
              <ShoppingBag size={40} color="#CBD5E1" style={{ margin: "0 auto 1rem" }} />
              <p style={{ fontSize: "16px", color: "#94A3B8" }}>Aucune commande trouvée</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {filtered.map(order => {
                const s = STATUS_CONFIG[order.status] || { label: order.status, color: "#64748B", bg: "#F1F5F9", icon: Clock };
                const StatusIcon = s.icon;
                return (
                  <div key={order.id} style={{ background: "white", borderRadius: 20, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", transition: "all 200ms" }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.75rem", marginBottom: "0.875rem" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                          <span style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>#{order.id.slice(-6).toUpperCase()}</span>
                          <span style={{ display: "flex", alignItems: "center", gap: 4, background: s.bg, color: s.color, fontSize: "12px", fontWeight: 600, padding: "0.2rem 0.625rem", borderRadius: 9999 }}>
                            <StatusIcon size={12} /> {s.label}
                          </span>
                        </div>
                        <p style={{ fontSize: "13px", color: "#94A3B8", marginTop: 4 }}>{order.date} · Chez {order.cook}</p>
                      </div>
                      <span style={{ fontSize: "20px", fontWeight: 800, color: "#F97316" }}>{order.total.toLocaleString("fr-DZ")} DA</span>
                    </div>

                    <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
                      {order.items.map(item => (
                        <div key={item} style={{ fontSize: "14px", color: "#475569", paddingBottom: "0.25rem" }}>• {item}</div>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      {order.status === "COMPLETED" && (
                        <>
                          <Link href={`/dashboard/orders/${order.id}`} style={{ height: 36, padding: "0 1rem", borderRadius: 10, background: "transparent", border: "1.5px solid #E2E8F0", color: "#475569", fontSize: "13px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                            Voir le détail <ChevronRight size={14} />
                          </Link>
                          <button style={{ height: 36, padding: "0 1rem", borderRadius: 10, background: "transparent", border: "1.5px solid #E2E8F0", color: "#475569", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                            <RotateCcw size={14} /> Commander à nouveau
                          </button>
                        </>
                      )}
                      {["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERING"].includes(order.status) && (
                        <>
                          <Link href={`/dashboard/orders/${order.id}`} style={{ height: 36, padding: "0 1rem", borderRadius: 10, background: "transparent", border: "1.5px solid #F97316", color: "#F97316", fontSize: "13px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                            Suivre <ChevronRight size={14} />
                          </Link>
                          <ContactButton
                            orderId={order.id}
                            recipientName={order.cook}
                            variant="icon"
                          />
                        </>
                      )}
                      {order.cookId && (
                        <Link href={`/cooks/${order.cookId}`} style={{ height: 36, padding: "0 1rem", borderRadius: 10, background: "transparent", border: "1.5px solid #E2E8F0", color: "#475569", fontSize: "13px", fontWeight: 500, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                          Voir {order.cook.split(" ")[0]}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
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
