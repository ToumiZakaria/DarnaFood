"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart";
import NotificationBell from "@/components/notifications/NotificationBell";

import {
  ShoppingCart, Menu, X, ChefHat, User, LogOut,
  LayoutDashboard, Heart, ChevronDown,
  UtensilsCrossed, Wheat, Flame, CookingPot, Coffee, Leaf
} from "lucide-react";

const navLinks = [
  { href: "/dishes", label: "Plats" },
  { href: "/cooks", label: "Cuisiniers" },
  { href: "/#how-it-works", label: "Comment ça marche" },
];

const categories = [
  { label: "Tous les plats", href: "/dishes", icon: UtensilsCrossed },
  { label: "Couscous", href: "/dishes?category=couscous", icon: Wheat },
  { label: "Tajine", href: "/dishes?category=tajine", icon: CookingPot },
  { label: "Chorba", href: "/dishes?category=chorba", icon: Flame },
  { label: "Pâtisserie", href: "/dishes?category=patisserie", icon: Coffee },
  { label: "Salades", href: "/dishes?category=salades", icon: Leaf },
  { label: "Grillades", href: "/dishes?category=grillades", icon: Flame },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const cartItems = useCartStore(state => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dishesOpen, setDishesOpen] = useState(false);
  const dishesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dishesRef.current && !dishesRef.current.contains(e.target as Node)) setDishesOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Hide on cook pages (after all hooks)
  if (pathname.startsWith("/cook")) return null;

  const isCook = session?.user?.role === "COOK";
  const isClient = !isCook;
  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? "U";

  const profileMenuItems = [
    { href: "/dashboard/buyer", label: "Mon compte", icon: LayoutDashboard },
    { href: "/dashboard/buyer/orders", label: "Mes commandes", icon: ShoppingCart },
    { href: "/dashboard/buyer/favorites", label: "Favoris", icon: Heart },
    { href: "/dashboard/buyer/settings", label: "Paramètres", icon: User },
  ];

  return (
    <>
      <header
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          height: 72,
          background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.90)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid #E2E8F0" : "1px solid rgba(226,232,240,0.5)",
          boxShadow: scrolled ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
          transition: "all 250ms ease",
        }}
      >
        <div className="container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>

          {/* ── Logo ── */}
          <Link href="/" id="nav-logo" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(249,115,22,0.3)" }}>
              <ChefHat size={24} color="white" strokeWidth={2.2} />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", color: "#0F172A", letterSpacing: "-0.02em" }}>
              Darna<span style={{ color: "#F97316" }}>Food</span>
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="desktop-nav">
            {/* Plats with dropdown */}
            <div ref={dishesRef} style={{ position: "relative" }}>
              <button
                id="nav-plats"
                onMouseEnter={() => setDishesOpen(true)}
                onClick={() => setDishesOpen(v => !v)}
                style={{ display: "flex", alignItems: "center", gap: "4px", padding: "0.45rem 0.875rem", background: "transparent", border: "none", cursor: "pointer", fontSize: "15px", fontWeight: 500, color: pathname.startsWith("/dishes") ? "#F97316" : "#475569", transition: "color 150ms", borderRadius: "var(--radius-md)" }}
              >
                Plats
                <ChevronDown size={14} style={{ transition: "transform 200ms", transform: dishesOpen ? "rotate(180deg)" : "rotate(0)" }} />
                {pathname.startsWith("/dishes") && (
                  <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: 2, background: "#F97316", borderRadius: 1 }} />
                )}
              </button>
              {dishesOpen && (
                <div
                  onMouseLeave={() => setDishesOpen(false)}
                  style={{ position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "white", borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,0.12)", border: "1px solid #E2E8F0", padding: "0.5rem", minWidth: 220, zIndex: 200, animation: "fadeIn 150ms ease" }}
                >
                  {categories.map(cat => (
                    <Link key={cat.href} href={cat.href} onClick={() => setDishesOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.875rem", borderRadius: 10, fontSize: "14px", fontWeight: 500, color: "#475569", textDecoration: "none", transition: "background 150ms" }}
                      onMouseEnter={e => (e.currentTarget.style.background = "#FFF7ED")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <cat.icon size={16} color="#F97316" />
                      {cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Cuisiniers */}
            <Link href="/cooks" id="nav-cooks" style={{ position: "relative", padding: "0.45rem 0.875rem", fontSize: "15px", fontWeight: 500, color: pathname.startsWith("/cooks") ? "#F97316" : "#475569", textDecoration: "none", borderRadius: "var(--radius-md)", transition: "color 150ms" }}>
              Cuisiniers
              {pathname.startsWith("/cooks") && (
                <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: 2, background: "#F97316", borderRadius: 1 }} />
              )}
            </Link>

            {/* Comment ça marche */}
            <Link href="/#how-it-works" id="nav-how" style={{ padding: "0.45rem 0.875rem", fontSize: "15px", fontWeight: 500, color: "#475569", textDecoration: "none", borderRadius: "var(--radius-md)", transition: "color 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F97316")}
              onMouseLeave={e => (e.currentTarget.style.color = "#475569")}
            >
              Comment ça marche
            </Link>
          </nav>

          {/* ── Right Actions ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {/* Devenir cuisinier — only for non-cooks, desktop */}
            {(!isCook || !session) && (
              <Link href="/auth/register" id="nav-become-cook" style={{ fontSize: "14px", fontWeight: 500, color: "#0D9488", textDecoration: "none", padding: "0 0.5rem", transition: "opacity 150ms" }}
                className="desktop-nav"
                onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
              >
                Devenir cuisinier
              </Link>
            )}

            {/* Cart — only for clients */}
            {(!isCook) && (
              <Link href="/cart" id="nav-cart" style={{ position: "relative", width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", textDecoration: "none", transition: "all 150ms" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FFF7ED"; e.currentTarget.style.color = "#F97316"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: 4, right: 4, width: 16, height: 16, borderRadius: "50%", background: "#F97316", color: "white", fontSize: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Favorites — only for logged-in clients */}
            {session && isClient && (
              <Link href="/dashboard/buyer/favorites" id="nav-favorites" style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", textDecoration: "none", transition: "all 150ms" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#FFF7ED"; e.currentTarget.style.color = "#F97316"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}
              >
                <Heart size={22} />
              </Link>
            )}

            {/* Notifications */}
            {session && (
              <NotificationBell />
            )}

            {/* Auth state */}
            {status === "loading" ? (
              <div style={{ width: 80, height: 40, borderRadius: 12, background: "#F1F5F9", animation: "pulse 1.5s infinite" }} />
            ) : session ? (
              <div ref={profileRef} style={{ position: "relative" }}>
                <button
                  id="nav-profile-btn"
                  onClick={() => setProfileOpen(v => !v)}
                  style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.3rem 0.75rem 0.3rem 0.3rem", borderRadius: 9999, border: "1.5px solid #E2E8F0", background: "white", cursor: "pointer", transition: "all 150ms", boxShadow: profileOpen ? "0 4px 12px rgba(0,0,0,0.08)" : "none" }}
                >
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #EA580C)", color: "white", fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {userInitial}
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "#0F172A", maxWidth: 90, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} className="desktop-nav">
                    {session.user?.name?.split(" ")[0] ?? "Profil"}
                  </span>
                  <ChevronDown size={14} color="#94A3B8" style={{ transition: "transform 200ms", transform: profileOpen ? "rotate(180deg)" : "rotate(0)" }} className="desktop-nav" />
                </button>

                {profileOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 10px)", right: 0, background: "white", borderRadius: 16, boxShadow: "0 10px 40px rgba(0,0,0,0.12)", border: "1px solid #E2E8F0", padding: "0.5rem", minWidth: 220, zIndex: 200, animation: "fadeIn 150ms ease" }}>
                    <div style={{ padding: "0.75rem 0.875rem 1rem", borderBottom: "1px solid #F1F5F9", marginBottom: "0.25rem" }}>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>{session.user?.name}</div>
                      <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: 2 }}>{session.user?.email}</div>
                    </div>

                    {isCook ? (
                      <Link href="/cook/dashboard" onClick={() => setProfileOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.875rem", borderRadius: 10, fontSize: "14px", fontWeight: 500, color: "#475569", textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#FFF7ED")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <LayoutDashboard size={15} /> Tableau de bord cuisinier
                      </Link>
                    ) : (
                      profileMenuItems.map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setProfileOpen(false)} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.875rem", borderRadius: 10, fontSize: "14px", fontWeight: 500, color: "#475569", textDecoration: "none" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFC")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <item.icon size={15} /> {item.label}
                        </Link>
                      ))
                    )}

                    <div style={{ borderTop: "1px solid #F1F5F9", marginTop: "0.25rem", paddingTop: "0.25rem" }}>
                      <button onClick={() => signOut({ callbackUrl: "/" })} style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.875rem", borderRadius: 10, fontSize: "14px", fontWeight: 500, color: "#EF4444", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#FEF2F2")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <LogOut size={15} /> Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/login" id="nav-login" style={{ height: 40, padding: "0 1rem", borderRadius: 12, border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", fontSize: "14px", fontWeight: 500, color: "#475569", textDecoration: "none", transition: "all 150ms" }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "#F97316")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
                  className="desktop-nav"
                >
                  Connexion
                </Link>
                <Link href="/auth/register" id="nav-register" style={{ height: 40, padding: "0 1rem", borderRadius: 12, background: "#F97316", display: "flex", alignItems: "center", fontSize: "14px", fontWeight: 600, color: "white", textDecoration: "none", transition: "all 150ms" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#EA580C")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#F97316")}
                >
                  S&apos;inscrire
                </Link>
              </>
            )}

            {/* Mobile Hamburger */}
            <button id="nav-mobile-menu" onClick={() => setMenuOpen(v => !v)} style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer", color: "#475569" }} className="mobile-only" aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Full-Screen Overlay ── */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 99, background: "white", display: "flex", flexDirection: "column", padding: "5.5rem 1.5rem 2rem" }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: "1.25rem", right: "1.25rem", width: 44, height: 44, borderRadius: 12, background: "#F8FAFC", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={24} color="#475569" />
          </button>

          <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ fontSize: "22px", fontWeight: 700, color: pathname.startsWith(link.href) ? "#F97316" : "#0F172A", textDecoration: "none", padding: "0.875rem 0", borderBottom: "1px solid #F1F5F9" }}>
                {link.label}
              </Link>
            ))}

          </nav>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "2rem" }}>
            {session ? (
              <button onClick={() => signOut({ callbackUrl: "/" })} style={{ height: 52, borderRadius: 12, background: "#F8FAFC", border: "1px solid #E2E8F0", fontSize: "16px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>
                Se déconnecter
              </button>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} style={{ height: 52, borderRadius: 12, border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 600, color: "#475569", textDecoration: "none" }}>
                  Connexion
                </Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)} style={{ height: 52, borderRadius: 12, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: "white", textDecoration: "none" }}>
                  S&apos;inscrire
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-only { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
