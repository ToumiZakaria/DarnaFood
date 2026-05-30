"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import {
  Settings, Bell, Shield, Trash2, ChevronRight, ToggleLeft, ToggleRight,
  LayoutDashboard, ShoppingBag, Heart, User, LogOut, AlertTriangle
} from "lucide-react";
import { signOut } from "next-auth/react";
import SecuritySection from "@/components/settings/SecuritySection";

const sideLinks = [
  { href: "/dashboard/buyer", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/buyer/orders", label: "Mes commandes", icon: ShoppingBag },
  { href: "/dashboard/buyer/favorites", label: "Favoris", icon: Heart },
  { href: "/dashboard/buyer/profile", label: "Mon profil", icon: User },
  { href: "/dashboard/buyer/settings", label: "Paramètres", icon: Settings },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
      {on
        ? <ToggleRight size={32} color="#F97316" />
        : <ToggleLeft size={32} color="#CBD5E1" />
      }
    </button>
  );
}

interface SettingsContentProps {
  twoFactorEnabled: boolean;
}

export default function SettingsContent({ twoFactorEnabled: initial2FA }: SettingsContentProps) {
  const [notifs, setNotifs] = useState({ orders: true, promos: true, news: false, sms: false });
  const [deleteModal, setDeleteModal] = useState(false);
  const [lang, setLang] = useState("fr");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initial2FA);

  const handleTwoFactorToggle = useCallback(() => {
    setTwoFactorEnabled(prev => !prev);
  }, []);

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "240px 1fr", gap: "2rem", alignItems: "flex-start" }} className="buyer-grid">

        {/* Sidebar */}
        <aside style={{ background: "white", borderRadius: 20, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", position: "sticky", top: "calc(72px + 1.5rem)" }}>
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {sideLinks.map(link => (
              <Link key={link.href} href={link.href}
                style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.875rem", borderRadius: 12, fontSize: "14px", fontWeight: 500, color: link.href === "/dashboard/buyer/settings" ? "#F97316" : "#475569", background: link.href === "/dashboard/buyer/settings" ? "#FFF7ED" : "transparent", textDecoration: "none" }}>
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
            <button onClick={() => signOut({ callbackUrl: "/" })} style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.875rem", borderRadius: 12, fontSize: "14px", fontWeight: 500, color: "#EF4444", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", marginTop: "0.5rem" }}>
              <LogOut size={16} /> Se déconnecter
            </button>
          </nav>
        </aside>

        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 800, color: "#0F172A" }}>Paramètres</h1>

          {/* Notifications */}
          <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bell size={18} color="#F97316" />
              </div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Notifications</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {[
                { key: "orders" as const, label: "Statut des commandes", sub: "Reçu, en route, livré…" },
                { key: "promos" as const, label: "Promotions et offres", sub: "Réductions et bons plans" },
                { key: "news" as const, label: "Newsletter", sub: "Nouvelles recettes et cuisiniers" },
                { key: "sms" as const, label: "SMS", sub: "Alertes par SMS" },
              ].map((item, i, arr) => (
                <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 0", borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "#0F172A" }}>{item.label}</div>
                    <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: 2 }}>{item.sub}</div>
                  </div>
                  <Toggle on={notifs[item.key]} onToggle={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))} />
                </div>
              ))}
            </div>
          </div>

          {/* Language & Currency */}
          <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#F0FDFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Settings size={18} color="#0D9488" />
              </div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Préférences</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Langue</label>
                <select value={lang} onChange={e => setLang(e.target.value)} style={{ height: 46, padding: "0 1rem", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: "14px", color: "#0F172A", background: "white", outline: "none", minWidth: 200 }}>
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                  <option value="kab">Tamazight</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Devise</label>
                <div style={{ height: 46, padding: "0 1rem", borderRadius: 12, border: "1.5px solid #E2E8F0", fontSize: "14px", color: "#0F172A", background: "#F8FAFC", display: "flex", alignItems: "center" }}>
                  Dinar algérien (DA)
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <SecuritySection twoFactorEnabled={twoFactorEnabled} onTwoFactorToggle={handleTwoFactorToggle} />

          {/* Danger Zone */}
          <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1.5px solid #FEE2E2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={18} color="#EF4444" />
              </div>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#EF4444", margin: 0 }}>Zone danger</h2>
            </div>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "1.25rem", lineHeight: 1.7 }}>
              La suppression de votre compte est définitive. Toutes vos commandes, favoris et données seront effacés.
            </p>
            <button onClick={() => setDeleteModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: 44, padding: "0 1.25rem", borderRadius: 12, background: "transparent", border: "2px solid #EF4444", color: "#EF4444", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "all 150ms" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <Trash2 size={16} /> Supprimer mon compte
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
          <div style={{ background: "white", borderRadius: 20, padding: "2rem", maxWidth: 420, width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <AlertTriangle size={28} color="#EF4444" />
            </div>
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A", textAlign: "center", marginBottom: "0.75rem" }}>Supprimer le compte ?</h3>
            <p style={{ fontSize: "14px", color: "#64748B", textAlign: "center", lineHeight: 1.7, marginBottom: "1.75rem" }}>
              Cette action est irréversible. Toutes vos données seront supprimées définitivement.
            </p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button onClick={() => setDeleteModal(false)} style={{ flex: 1, height: 48, borderRadius: 12, border: "1.5px solid #E2E8F0", background: "white", fontSize: "15px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>
                Annuler
              </button>
              <button style={{ flex: 1, height: 48, borderRadius: 12, background: "#EF4444", border: "none", fontSize: "15px", fontWeight: 700, color: "white", cursor: "pointer" }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .buyer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
