"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { Bell, Check, Package, Star, MessageCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: "NEW_ORDER" | "ORDER_CONFIRMED" | "ORDER_PREPARING" | "ORDER_READY" | "ORDER_DELIVERING" | "ORDER_COMPLETED" | "ORDER_CANCELLED" | "REVIEW" | "MESSAGE" | "SYSTEM";
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

const notificationIcons: Record<string, typeof Package> = {
  NEW_ORDER: Package,
  ORDER_CONFIRMED: Check,
  ORDER_PREPARING: Package,
  ORDER_READY: Package,
  ORDER_DELIVERING: AlertCircle,
  ORDER_COMPLETED: Star,
  ORDER_CANCELLED: AlertCircle,
  REVIEW: Star,
  MESSAGE: MessageCircle,
  SYSTEM: AlertCircle,
};

const notificationColors: Record<string, string> = {
  NEW_ORDER: "bg-amber-100 text-amber-600",
  ORDER_CONFIRMED: "bg-green-100 text-green-600",
  ORDER_PREPARING: "bg-blue-100 text-blue-600",
  ORDER_READY: "bg-purple-100 text-purple-600",
  ORDER_DELIVERING: "bg-indigo-100 text-indigo-600",
  ORDER_COMPLETED: "bg-yellow-100 text-yellow-600",
  ORDER_CANCELLED: "bg-red-100 text-red-600",
  REVIEW: "bg-yellow-100 text-yellow-600",
  MESSAGE: "bg-teal-100 text-teal-600",
  SYSTEM: "bg-gray-100 text-gray-600",
};

export default function NotificationBell() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data: Notification[]) => {
        setNotifications(data);
        setUnreadCount(data.filter((n) => !n.read).length);
      })
      .catch(() => {});
  }, [session]);

  useEffect(() => {
    const pc = pusherClient;
    if (!session?.user?.id || !pc) return;
    const channel = pc.subscribe(`private-user-${session.user.id}`);
    channel.bind("notification", (data: Notification) => {
      setNotifications((prev) => [data, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    channel.bind("order-status-update", (data: any) => {
      const newNotif: Notification = {
        id: `status-${Date.now()}`,
        type: "ORDER_READY",
        message: data.statusLabel || `Statut: ${data.status}`,
        read: false,
        createdAt: new Date().toISOString(),
        link: data.link || `/dashboard/orders/${data.orderId}`,
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    return () => {
      pc.unsubscribe(`private-user-${session.user.id}`);
    };
  }, [session]);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const markAsRead = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    await fetch(`/api/notifications/${id}`, { method: "PATCH" }).catch(() => {});
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const markAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await fetch("/api/notifications/read-all", { method: "PATCH" }).catch(() => {});
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleBellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((v) => !v);
  };

  const handleNotifClick = (n: Notification) => {
    if (!n.read) {
      markAsRead(n.id);
    }
    if (n.link) {
      setOpen(false);
      window.location.href = n.link;
    }
  };

  if (!session) return null;

  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <button
        onClick={handleBellClick}
        type="button"
        style={{ position: "relative", width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", background: "transparent", border: "none", cursor: "pointer", transition: "all 150ms" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "#FFF7ED"; e.currentTarget.style.color = "#F97316"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span style={{ position: "absolute", top: 4, right: 4, minWidth: 18, height: 18, borderRadius: "50%", background: "#EF4444", color: "white", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, padding: "0 4px" }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 10px)", width: 380, background: "white", borderRadius: 20, boxShadow: "0 10px 40px rgba(0,0,0,0.12)", border: "1px solid #E2E8F0", zIndex: 50, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 1.25rem", borderBottom: "1px solid #E2E8F0" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} type="button" style={{ fontSize: "13px", fontWeight: 600, color: "#F97316", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                Tout marquer comme lu
              </button>
            )}
          </div>

          <div style={{ maxHeight: 400, overflowY: "auto" }}>
            {notifications.length === 0 ? (
              <div style={{ padding: "3rem 0", textAlign: "center" }}>
                <Bell size={48} color="#E2E8F0" style={{ margin: "0 auto 0.75rem" }} />
                <p style={{ fontSize: "14px", color: "#94A3B8" }}>Aucune notification</p>
              </div>
            ) : (
              notifications.map((n) => {
                const Icon = notificationIcons[n.type] || AlertCircle;
                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotifClick(n)}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      padding: "1rem 1.25rem",
                      borderBottom: "1px solid #F1F5F9",
                      cursor: "pointer",
                      transition: "background 150ms",
                      background: !n.read ? "#FFF7ED" : "white",
                      borderLeft: !n.read ? "3px solid #F97316" : "3px solid transparent",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = !n.read ? "#FFF7ED" : "white"; }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "10px", ...(notificationColors[n.type] ? { background: notificationColors[n.type].split(" ")[0], color: notificationColors[n.type].split(" ")[1] } : { background: "#F1F5F9", color: "#64748B" }) }}>
                      <Icon size={18} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: 2 }}>{n.message}</p>
                      <p style={{ fontSize: "11px", color: "#94A3B8" }}>{n.createdAt ? new Date(n.createdAt).toLocaleDateString("fr-DZ", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}</p>
                    </div>
                    {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F97316", flexShrink: 0, marginTop: 4 }} />}
                  </div>
                );
              })
            )}
          </div>

          <Link
            href="/dashboard/notifications"
            onClick={() => setOpen(false)}
            style={{ display: "block", textAlign: "center", padding: "0.75rem", fontSize: "13px", fontWeight: 600, color: "#F97316", textDecoration: "none", borderTop: "1px solid #E2E8F0", transition: "background 150ms" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "white"; }}
          >
            Voir toutes les notifications
          </Link>
        </div>
      )}
    </div>
  );
}
