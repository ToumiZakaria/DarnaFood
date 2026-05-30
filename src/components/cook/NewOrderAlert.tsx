"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { playNotificationSound } from "@/lib/notificationSound";
import { Bell, Package, X } from "lucide-react";
import Link from "next/link";

interface NewOrder {
  id: string;
  customerName: string;
  total: number;
  items: number;
  address: string;
}

export default function NewOrderAlert() {
  const { data: session } = useSession();
  const [newOrders, setNewOrders] = useState<NewOrder[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pc = pusherClient;
    if (!session?.user?.id || session.user.role !== "COOK" || !pc) return;

    const channel = pc.subscribe(`private-user-${session.user.id}`);

    channel.bind("new-order", (data: NewOrder) => {
      setNewOrders((prev) => [...prev, data]);
      playNotificationSound();
    });

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      pc.unsubscribe(`private-user-${session.user.id}`);
    };
  }, [session]);

  const dismissOrder = (id: string) => {
    setNewOrders((prev) => prev.filter((o) => o.id !== id));
  };

  if (newOrders.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      {newOrders.map((order) => (
        <div
          key={order.id}
          style={{
            background: "white",
            borderRadius: 20,
            boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
            padding: "1.25rem",
            width: 360,
            borderLeft: "4px solid #F97316",
            animation: "slideInRight 300ms ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Package size={20} color="#F97316" />
              </div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>Nouvelle commande !</p>
                <p style={{ fontSize: "13px", color: "#64748B" }}>{order.customerName}</p>
              </div>
            </div>
            <button
              onClick={() => dismissOrder(order.id)}
              style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "#94A3B8" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F1F5F9"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <X size={16} />
            </button>
          </div>
          <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "#F8FAFC", borderRadius: 12 }}>
            <p style={{ fontSize: "13px", color: "#475569" }}>{order.items} article(s)</p>
            <p style={{ fontSize: "18px", fontWeight: 700, color: "#F97316", marginTop: 4 }}>{order.total.toLocaleString("fr-DZ")} DA</p>
            <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: 4 }}>{order.address}</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
            <Link
              href={`/cook/orders/${order.id}`}
              onClick={() => dismissOrder(order.id)}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 12,
                background: "#F97316",
                color: "white",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "background 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#EA580C"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#F97316"; }}
            >
              Voir la commande
            </Link>
            <button
              onClick={() => dismissOrder(order.id)}
              style={{
                flex: 1,
                height: 40,
                borderRadius: 12,
                border: "1px solid #E2E8F0",
                background: "white",
                fontSize: "13px",
                fontWeight: 600,
                color: "#475569",
                cursor: "pointer",
                transition: "background 150ms",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
            >
              Ignorer
            </button>
          </div>
        </div>
      ))}
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(100px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
