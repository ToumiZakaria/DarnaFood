"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, ShoppingBag, Heart, User, Settings, LogOut,
} from "lucide-react";

export const BUYER_LINKS = [
  { href: "/dashboard/buyer", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/buyer/orders", label: "Mes commandes", icon: ShoppingBag },
  { href: "/dashboard/buyer/favorites", label: "Favoris", icon: Heart },
  { href: "/dashboard/buyer/profile", label: "Mon profil", icon: User },
  { href: "/dashboard/buyer/settings", label: "Paramètres", icon: Settings },
];

export default function BuyerSidebar({ userName, userInitial }: { userName?: string; userInitial?: string }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard/buyer") return pathname === "/dashboard/buyer";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="buyer-sidebar-desktop"
        style={{
          background: "white",
          borderRadius: 20,
          padding: "1.5rem",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          border: "1px solid #F1F5F9",
          position: "sticky",
          top: "calc(72px + 1.5rem)",
        }}
      >
        {userName && userInitial && (
          <div style={{ textAlign: "center", paddingBottom: "1.25rem", marginBottom: "1rem", borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #EA580C)", color: "white", fontSize: "22px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.625rem" }}>
              {userInitial}
            </div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{userName}</div>
            <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: 2 }}>Mon compte</div>
          </div>
        )}

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {BUYER_LINKS.map(link => (
            <Link key={link.href} href={link.href}
              style={{
                display: "flex", alignItems: "center", gap: "0.625rem",
                padding: "0.625rem 0.875rem", borderRadius: 12,
                fontSize: "14px", fontWeight: isActive(link.href) ? 600 : 500,
                color: isActive(link.href) ? "#F97316" : "#475569",
                background: isActive(link.href) ? "#FFF7ED" : "transparent",
                textDecoration: "none", transition: "all 150ms",
              }}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
          <button onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.875rem", borderRadius: 12, fontSize: "14px", fontWeight: 500, color: "#EF4444", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", marginTop: "0.5rem" }}>
            <LogOut size={16} /> Se déconnecter
          </button>
        </nav>
      </aside>

      {/* Mobile horizontal tabs */}
      <div
        className="buyer-sidebar-mobile"
        style={{
          background: "white",
          borderBottom: "1px solid #F1F5F9",
          padding: "0.5rem 0.75rem",
          display: "none",
          gap: "0.25rem",
          overflowX: "auto",
          position: "sticky",
          top: 72,
          zIndex: 30,
        }}
      >
        {BUYER_LINKS.map(link => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href}
              style={{
                display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.5rem 0.75rem", borderRadius: 10,
                fontSize: "12px", fontWeight: isActive(link.href) ? 700 : 500,
                color: isActive(link.href) ? "#F97316" : "#475569",
                background: isActive(link.href) ? "#FFF7ED" : "transparent",
                textDecoration: "none", whiteSpace: "nowrap",
                flexShrink: 0,
                border: isActive(link.href) ? "1.5px solid #F97316" : "1.5px solid transparent",
              }}
            >
              <Icon size={13} />
              {link.label}
            </Link>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .buyer-sidebar-desktop { display: none !important; }
          .buyer-sidebar-mobile { display: flex !important; }
        }
        .buyer-sidebar-mobile::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
