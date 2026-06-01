"use client";

import Link from "next/link";
import { useState } from "react";
import ContactButton from "@/components/chat/ContactButton";
import BuyerSidebar from "@/components/dashboard/BuyerSidebar";
import { useSession } from "next-auth/react";
import {
  ShoppingBag, Star, ChevronRight, Search,
  CheckCircle, Clock, Truck, XCircle, RotateCcw
} from "lucide-react";

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
  dish: { name: string };
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  totalAmount: number;
  cook: { id: string; name: string | null };
  items: OrderItem[];
}

export default function BuyerOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const { data: session } = useSession();

  const formattedOrders = initialOrders.map(order => {
    const dishNames = order.items.map(i => `${i.dish?.name || "Plat"} × ${i.quantity}`);
    const dateStr = new Date(order.createdAt).toLocaleDateString("fr-DZ", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
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

  const userName = session?.user?.name ?? undefined;
  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? "U";

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "1.5rem 1rem", display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem", alignItems: "flex-start" }} className="buyer-grid">

        <BuyerSidebar userName={userName} userInitial={userInitial} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.25rem" }}>Mes commandes</h1>
            <p style={{ fontSize: "14px", color: "#64748B" }}>{initialOrders.length} commande{initialOrders.length > 1 ? "s" : ""} au total</p>
          </div>

          {/* Filter + search */}
          <div style={{ background: "white", borderRadius: 14, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.625rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", gap: "0.375rem", overflowX: "auto" }} className="scrollbar-hide">
              {FILTER_TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{ height: 32, padding: "0 0.75rem", borderRadius: 9999, border: "none", background: tab === t.key ? "#F97316" : "#F1F5F9", color: tab === t.key ? "white" : "#64748B", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 150ms", whiteSpace: "nowrap", flexShrink: 0 }}>
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#F8FAFC", borderRadius: 10, padding: "0 0.75rem", border: "1.5px solid #E2E8F0", height: 36 }}>
              <Search size={14} color="#94A3B8" />
              <input value={q} onChange={e => setQ(e.target.value)} placeholder="Chercher une commande…" style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "#0F172A" }} />
            </div>
          </div>

          {/* Orders list */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <ShoppingBag size={36} color="#CBD5E1" style={{ margin: "0 auto 0.75rem" }} />
              <p style={{ fontSize: "14px", color: "#94A3B8" }}>Aucune commande trouvée</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {filtered.map(order => {
                const s = STATUS_CONFIG[order.status] || { label: order.status, color: "#64748B", bg: "#F1F5F9", icon: Clock };
                const StatusIcon = s.icon;
                return (
                  <div key={order.id} style={{ background: "white", borderRadius: 16, padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", transition: "all 200ms" }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)")}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.625rem" }}>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>#{order.id.slice(-6).toUpperCase()}</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3, background: s.bg, color: s.color, fontSize: "11px", fontWeight: 600, padding: "0.15rem 0.5rem", borderRadius: 9999 }}>
                            <StatusIcon size={10} /> {s.label}
                          </span>
                        </div>
                        <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: 3 }}>{order.date} · Chez {order.cook}</p>
                      </div>
                      <span style={{ fontSize: "16px", fontWeight: 800, color: "#F97316", whiteSpace: "nowrap" }}>{order.total.toLocaleString("fr-DZ")} DA</span>
                    </div>

                    <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "0.5rem 0.75rem", marginBottom: "0.75rem" }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ fontSize: "12px", color: "#475569", paddingBottom: i < order.items.length - 1 ? 2 : 0 }}>• {item}</div>
                      ))}
                    </div>

                    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                      {order.status === "COMPLETED" && (
                        <>
                          <Link href={`/dashboard/orders/${order.id}`} style={{ height: 34, padding: "0 0.75rem", borderRadius: 9, background: "transparent", border: "1.5px solid #E2E8F0", color: "#475569", fontSize: "12px", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}>
                            Détail <ChevronRight size={12} />
                          </Link>
                          <button style={{ height: 34, padding: "0 0.75rem", borderRadius: 9, background: "transparent", border: "1.5px solid #E2E8F0", color: "#475569", fontSize: "12px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 3 }}>
                            <RotateCcw size={12} /> Recommander
                          </button>
                        </>
                      )}
                      {["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERING"].includes(order.status) && (
                        <>
                          <Link href={`/dashboard/orders/${order.id}`} style={{ height: 34, padding: "0 0.75rem", borderRadius: 9, background: "transparent", border: "1.5px solid #F97316", color: "#F97316", fontSize: "12px", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}>
                            Suivre <ChevronRight size={12} />
                          </Link>
                          <ContactButton orderId={order.id} recipientName={order.cook} variant="icon" />
                        </>
                      )}
                      {order.cookId && (
                        <Link href={`/cooks/${order.cookId}`} style={{ height: 34, padding: "0 0.75rem", borderRadius: 9, background: "transparent", border: "1.5px solid #E2E8F0", color: "#475569", fontSize: "12px", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 3 }}>
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
        @media (max-width: 900px) { .buyer-grid { grid-template-columns: 1fr !important; } }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
