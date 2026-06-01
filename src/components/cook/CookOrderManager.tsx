"use client";

import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Clock, Truck, Store, CheckCircle, XCircle, ChefHat, User, MapPin, Phone, ChevronDown, ChevronUp } from "lucide-react";
import { useRouter } from "next/navigation";
import ContactButton from "@/components/chat/ContactButton";

export default function CookOrderManager({ initialOrders, cookId }: { initialOrders: any[]; cookId: string }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("ALL");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });
    const channel = pusher.subscribe(`private-cook-${cookId}`);
    channel.bind("new-order", () => {
      toast.success("Nouvelle commande reçue !");
      router.refresh();
    });
    return () => pusher.unsubscribe(`private-cook-${cookId}`);
  }, [cookId, router]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
      toast.success("Statut mis à jour !");
    } catch {
      toast.error("Impossible de modifier le statut");
    }
  };

  const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
    PENDING:    { label: "Nouvelle",       bg: "#FFF7ED", color: "#F97316" },
    CONFIRMED:  { label: "Acceptée",       bg: "#EFF6FF", color: "#3B82F6" },
    PREPARING:  { label: "En préparation", bg: "#DBEAFE", color: "#2563EB" },
    READY:      { label: "Prête",          bg: "#FAF5FF", color: "#A855F7" },
    DELIVERING: { label: "En route",       bg: "#EEF2FF", color: "#6366F1" },
    COMPLETED:  { label: "Livrée",         bg: "#F0FDF4", color: "#22C55E" },
    CANCELLED:  { label: "Annulée",        bg: "#FEF2F2", color: "#EF4444" },
  };

  // Filter logic
  const counts = {
    ALL: orders.length,
    PENDING: orders.filter(o => o.status === "PENDING").length,
    PREPARING: orders.filter(o => ["CONFIRMED", "PREPARING"].includes(o.status)).length,
    READY: orders.filter(o => o.status === "READY").length,
    DELIVERING: orders.filter(o => o.status === "DELIVERING").length,
    COMPLETED: orders.filter(o => o.status === "COMPLETED").length,
  };

  const filteredOrders = orders.filter(o => {
    if (filter === "ALL") return true;
    if (filter === "PENDING") return o.status === "PENDING";
    if (filter === "PREPARING") return ["CONFIRMED", "PREPARING"].includes(o.status);
    if (filter === "READY") return o.status === "READY";
    if (filter === "DELIVERING") return o.status === "DELIVERING";
    if (filter === "COMPLETED") return o.status === "COMPLETED";
    return true;
  });

  return (
    <div>
      {/* ── Filter Tabs ── */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "8px", marginBottom: "1.5rem" }}>
        {[
          { id: "ALL", label: `Toutes (${counts.ALL})` },
          { id: "PENDING", label: `Nouvelles (${counts.PENDING})` },
          { id: "PREPARING", label: `En préparation (${counts.PREPARING})` },
          { id: "READY", label: `Prêtes (${counts.READY})` },
          { id: "DELIVERING", label: `En livraison (${counts.DELIVERING})` },
          { id: "COMPLETED", label: `Livrées (${counts.COMPLETED})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            style={{
              padding: "6px 16px",
              borderRadius: "9999px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: filter === tab.id ? "var(--primary)" : "white",
              color: filter === tab.id ? "white" : "#64748B",
              border: filter === tab.id ? "1px solid var(--primary)" : "1px solid var(--border)",
              transition: "all 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Orders List ── */}
      {filteredOrders.length === 0 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "4rem 0" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
            <Clock size={32} color="#94A3B8" />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Aucune commande ici</h3>
          <p style={{ fontSize: "15px", color: "#64748B" }}>Les commandes apparaîtront quand un client passe une commande.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredOrders.map(order => {
            const isExpanded = expandedOrderId === order.id;
            const statusLabel = statusConfig[order.status] ?? { label: order.status, bg: "#F1F5F9", color: "#64748B" };

            return (
              <div key={order.id} className="card card-hover cook-order-card" style={{ background: "white", borderRadius: "20px", padding: "20px", display: "flex", gap: "20px", flexDirection: "column" }}>
                
                {/* Main Row */}
                <div className="cook-order-row" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                  {/* Left: Info */}
                  <div className="cook-order-info" style={{ flex: "1 1 300px", minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>#{order.id.slice(0, 8).toUpperCase()}</span>
                      <span style={{ padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600, background: statusLabel.bg, color: statusLabel.color }}>
                        {statusLabel.label}
                      </span>
                      <span style={{ fontSize: "13px", color: "#94A3B8" }}>{format(new Date(order.createdAt), "HH:mm")}</span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <User size={16} color="var(--text-muted)" />
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{order.user?.name || "Client"}</span>
                      {order.deliveryAddress && (
                        <span style={{ fontSize: "13px", color: "#94A3B8", display: "flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={12} /> {order.deliveryAddress.split(",")[0]}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                      {order.items.map((item: any, i: number) => (
                        <div key={i}>{item.dish?.name || "Plat"} × {item.quantity}</div>
                      ))}
                    </div>

                    <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--primary)" }}>
                      {order.totalAmount.toLocaleString("fr-DZ")} DA
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="cook-order-actions" style={{ flex: "0 0 200px", display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center", minWidth: 0 }}>
                    {order.status === "PENDING" && (
                      <>
                        <button onClick={() => updateStatus(order.id, "CONFIRMED")} className="action-btn" style={{ background: "var(--secondary)", color: "white", border: "none" }}>Accepter la commande</button>
                        <button onClick={() => updateStatus(order.id, "CANCELLED")} className="action-btn" style={{ background: "transparent", color: "var(--error)", border: "1px solid var(--error)" }}>Refuser</button>
                      </>
                    )}
                    {order.status === "CONFIRMED" && (
                      <button onClick={() => updateStatus(order.id, "PREPARING")} className="action-btn" style={{ background: "var(--secondary)", color: "white", border: "none" }}>Commencer préparation</button>
                    )}
                    {order.status === "PREPARING" && (
                      <button onClick={() => updateStatus(order.id, "READY")} className="action-btn" style={{ background: "var(--primary)", color: "white", border: "none" }}>Marquer prête</button>
                    )}
                    {order.status === "READY" && order.type === "DELIVERY" && (
                      <button onClick={() => updateStatus(order.id, "DELIVERING")} className="action-btn" style={{ background: "#3B82F6", color: "white", border: "none" }}>Marquer en livraison</button>
                    )}
                    {order.status === "READY" && order.type === "PICKUP" && (
                      <button onClick={() => updateStatus(order.id, "COMPLETED")} className="action-btn" style={{ background: "#22C55E", color: "white", border: "none" }}>Valider retrait</button>
                    )}
                    {order.status === "DELIVERING" && (
                      <button onClick={() => updateStatus(order.id, "COMPLETED")} className="action-btn" style={{ background: "#22C55E", color: "white", border: "none" }}>Marquer livrée</button>
                    )}

                    <ContactButton
                      orderId={order.id}
                      recipientName={order.user?.name || "Client"}
                      recipientAvatar={order.user?.image}
                      variant="button"
                      label="Contacter"
                    />
                  </div>
                </div>

                {/* Expand Toggle */}
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px", display: "flex", justifyContent: "center" }}>
                  <button 
                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                    style={{ display: "flex", alignItems: "center", gap: "6px", background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}
                  >
                    {isExpanded ? "Masquer les détails" : "Voir les détails"}
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div style={{ padding: "16px", background: "var(--bg-secondary)", borderRadius: "12px", marginTop: "8px", display: "flex", flexDirection: "column", gap: "16px" }}>
                    {order.deliveryAddress && (
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Adresse de livraison</div>
                        <div style={{ fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                          <MapPin size={16} color="var(--primary)" style={{ marginTop: "2px" }} />
                          {order.deliveryAddress}
                        </div>
                      </div>
                    )}
                    {order.user?.phone && (
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Téléphone</div>
                        <div style={{ fontSize: "14px", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: "8px" }}>
                          <Phone size={16} color="var(--primary)" />
                          {order.user.phone}
                        </div>
                      </div>
                    )}
                    {order.notes && (
                      <div>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "4px" }}>Note du client</div>
                        <div style={{ fontSize: "14px", color: "#92400E", background: "#FEF3C7", padding: "12px", borderRadius: "8px", fontStyle: "italic" }}>
                          "{order.notes}"
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .action-btn {
          height: 40px;
          padding: 0 16px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .action-btn:hover {
          filter: brightness(0.95);
        }
        .hover-bg-gray:hover {
          background: var(--bg-secondary) !important;
        }
        @media (max-width: 640px) {
          .cook-order-card { padding: 0.875rem !important; }
          .cook-order-row { gap: 0.75rem !important; }
          .cook-order-info { flex-basis: 100% !important; }
          .cook-order-actions { flex-basis: 100% !important; }
        }
      `}</style>
    </div>
  );
}
