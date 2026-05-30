"use client";

import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { LayoutDashboard, ShoppingBag, UtensilsCrossed, User, Settings, LogOut, MessageSquare, Menu } from "lucide-react";
import NotificationBell from "@/components/notifications/NotificationBell";
import { useCookSidebar } from "@/store/cookSidebar";

const dropdownItems = [
  { label: "Mon compte",    href: "/cook/dashboard", icon: LayoutDashboard },
  { label: "Mes commandes", href: "/cook/orders",    icon: ShoppingBag },
  { label: "Mes plats",     href: "/cook/dishes",    icon: UtensilsCrossed },
  { label: "Mon profil",    href: "/cook/profile",   icon: User },
  { label: "Paramètres",    href: "/cook/settings",  icon: Settings },
];

export default function CookHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { toggle: toggleSidebar } = useCookSidebar();
  const userName = session?.user?.name || "Cuisinier";
  const userEmail = session?.user?.email || "";
  const initial = userName.charAt(0).toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  let title = "Tableau de bord";
  if (pathname.includes("/orders")) title = "Commandes";
  else if (pathname.includes("/dishes")) title = "Mes plats";
  else if (pathname.includes("/profile")) title = "Mon profil";
  else if (pathname.includes("/public")) title = "Page publique";
  else if (pathname.includes("/settings")) title = "Paramètres";

  return (
    <header
      style={{
        height: 64,
        background: "white",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <button
          id="cook-sidebar-toggle"
          onClick={toggleSidebar}
          className="mobile-only"
          style={{ width: 40, height: 40, borderRadius: 12, display: "none", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "#475569" }}
          aria-label="Menu"
        >
          <Menu size={22} />
        </button>
        <div style={{ fontSize: "22px", fontWeight: 700, color: "#1E293B" }}>
          {title}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* Messages */}
        <button className="header-icon-btn" style={{ position: "relative" }}>
          <MessageSquare size={20} color="var(--text-secondary)" />
          <span style={{
            position: "absolute", top: 6, right: 6, width: 8, height: 8,
            background: "var(--primary)", borderRadius: "50%", border: "2px solid white"
          }} />
        </button>

        {/* Notifications */}
        <NotificationBell />

        {/* Dashboard button */}
        <Link
          href="/cook/dashboard"
          style={{
            height: 36,
            padding: "0 1rem",
            background: "var(--secondary)",
            color: "white",
            borderRadius: "var(--radius-xl)",
            fontSize: "14px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          className="hover-bg-teal-dark"
        >
          Tableau de bord
        </Link>

        {/* Avatar Dropdown */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0.25rem",
              borderRadius: "var(--radius-full)",
              transition: "background 0.2s",
            }}
            className="hover-bg-gray"
          >
            <div style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
            }}>
              {initial}
            </div>
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>
              {userName.split(" ")[0]}
            </span>
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                right: 0,
                width: 280,
                background: "white",
                borderRadius: 20,
                boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
                border: "1px solid var(--border)",
                padding: "0.5rem",
              }}
            >
              {/* User info header */}
              <div style={{ padding: "0.5rem 0.75rem 0.75rem", borderBottom: "1px solid var(--border)", marginBottom: "0.25rem" }}>
                <div style={{ fontSize: "15px", fontWeight: 600, color: "#0F172A", marginBottom: 2 }}>{userName}</div>
                <div style={{ fontSize: "13px", color: "#64748B" }}>{userEmail}</div>
              </div>

              {/* Menu items */}
              {dropdownItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setDropdownOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.625rem 0.75rem",
                    borderRadius: 12,
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "#1E293B",
                    textDecoration: "none",
                    transition: "background 0.15s",
                  }}
                  className="dropdown-item-hover"
                >
                  <item.icon size={18} style={{ color: "#64748B", flexShrink: 0 }} />
                  {item.label}
                </Link>
              ))}

              <div style={{ height: 1, background: "var(--border)", margin: "0.25rem 0" }} />
              
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.625rem 0.75rem",
                  borderRadius: 12,
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "#EF4444",
                  textDecoration: "none",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "left",
                  transition: "background 0.15s",
                  fontFamily: "inherit",
                }}
                className="dropdown-item-hover-red"
              >
                <LogOut size={18} style={{ flexShrink: 0 }} />
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .header-icon-btn {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: none; background: transparent;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        .header-icon-btn:hover { background: var(--bg-secondary); }
        .hover-bg-teal-dark:hover { background: var(--secondary-dark) !important; }
        .hover-bg-gray:hover { background: var(--bg-secondary); }
        .dropdown-item-hover:hover { background: #FAEEDA; }
        .dropdown-item-hover-red:hover { background: #FEF2F2; }
      `}</style>
    </header>
  );
}
