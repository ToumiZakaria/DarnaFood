"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { pusherClient } from "@/lib/pusher";
import { useCookSidebar } from "@/store/cookSidebar";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  User,
  Globe,
  Settings,
  Camera,
  LogOut,
  X,
} from "lucide-react";

const links = [
  { href: "/cook/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/cook/orders",    label: "Commandes",       icon: ShoppingBag },
  { href: "/cook/dishes",    label: "Mes plats",       icon: UtensilsCrossed },
  { href: "/cook/profile",   label: "Mon profil",      icon: User },
  { href: "/cook/public",    label: "Page publique",    icon: Globe },
  { href: "/cook/settings",  label: "Paramètres",       icon: Settings },
];

export default function CookSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { isOpen, close } = useCookSidebar();
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const userName = session?.user?.name || "Cuisinier";
  const initial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/cook/orders/count?status=PENDING")
      .then((res) => res.json())
      .then((data) => setNewOrdersCount(data.count || 0))
      .catch(() => {});
  }, [session]);

  useEffect(() => {
    const pc = pusherClient;
    if (!session?.user?.id || !pc) return;
    const channel = pc.subscribe(`private-user-${session.user.id}`);
    channel.bind("new-order", () => {
      setNewOrdersCount((prev) => prev + 1);
    });
    return () => {
      pc.unsubscribe(`private-user-${session.user.id}`);
    };
  }, [session]);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          onClick={close}
          className="mobile-sidebar-backdrop"
          style={{
            position: "fixed", inset: 0, zIndex: 49,
            background: "rgba(0,0,0,0.4)",
          }}
        />
      )}
      <aside
        style={{
          width: 280,
          height: "100vh",
          background: "white",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          transition: "transform 250ms ease",
        }}
        className={isOpen ? "cook-sidebar-mobile-open" : "cook-sidebar-mobile-hidden"}
      >
        {/* Header */}
      <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--primary)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.25rem",
            fontWeight: 700,
          }}>
            {initial}
          </div>
          <div style={{
            position: "absolute",
            bottom: -2,
            right: -2,
            width: 20,
            height: 20,
            background: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
          }}>
            <Camera size={10} color="var(--text-secondary)" />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Espace Cuisinier</div>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-muted)" }}>{userName}</div>
        </div>
        <button
          onClick={close}
          className="mobile-sidebar-close"
          style={{ width: 36, height: 36, borderRadius: 10, display: "none", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)", border: "none", cursor: "pointer", color: "#475569", flexShrink: 0 }}
          aria-label="Fermer le menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/cook/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                height: 44,
                borderRadius: "var(--radius-xl)",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0 1rem",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--primary)" : "var(--text-secondary)",
                background: isActive ? "var(--primary-light)" : "transparent",
                borderLeft: isActive ? "3px solid var(--primary)" : "3px solid transparent",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              className={!isActive ? "hover-bg-primary-light" : ""}
            >
              <link.icon size={20} />
              <span style={{ flex: 1 }}>{link.label}</span>
              {link.href === "/cook/orders" && newOrdersCount > 0 && (
                <span style={{ minWidth: 20, height: 20, background: "#EF4444", color: "white", fontSize: "11px", fontWeight: 700, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                  {newOrdersCount > 9 ? "9+" : newOrdersCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div style={{ marginTop: "auto", padding: "1rem", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          style={{
            height: 44,
            borderRadius: "var(--radius-xl)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0 1rem",
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--error)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            transition: "all 0.2s",
            fontFamily: "inherit",
          }}
          className="hover-bg-red"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </div>
      
      </aside>
      
      <style jsx>{`
        .hover-bg-primary-light:hover {
          background: rgba(250, 238, 218, 0.5) !important;
        }
        .hover-bg-red:hover {
          background: var(--error-bg) !important;
        }
        @media (max-width: 1024px) {
          .cook-sidebar-mobile-hidden { transform: translateX(-100%); }
          .cook-sidebar-mobile-open { transform: translateX(0) !important; }
          .mobile-sidebar-close { display: flex !important; }
          .mobile-sidebar-backdrop { display: block !important; }
        }
        @media (min-width: 1025px) {
          .mobile-sidebar-backdrop { display: none !important; }
          .mobile-sidebar-close { display: none !important; }
        }
      `}</style>
    </>
  );
}
