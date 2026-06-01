"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  Settings, Bell, Shield, Trash2, ToggleLeft, ToggleRight,
  LogOut, AlertTriangle
} from "lucide-react";
import SecuritySection from "@/components/settings/SecuritySection";
import BuyerSidebar from "@/components/dashboard/BuyerSidebar";

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center" }}>
      {on ? <ToggleRight size={32} color="#F97316" /> : <ToggleLeft size={32} color="#CBD5E1" />}
    </button>
  );
}

interface SettingsContentProps { twoFactorEnabled: boolean }

export default function SettingsContent({ twoFactorEnabled: initial2FA }: SettingsContentProps) {
  const [notifs, setNotifs] = useState({ orders: true, promos: true, news: false, sms: false });
  const [deleteModal, setDeleteModal] = useState(false);
  const [lang, setLang] = useState("fr");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initial2FA);
  const { data: session } = useSession();

  const handleTwoFactorToggle = useCallback(() => setTwoFactorEnabled(prev => !prev), []);

  const userName = session?.user?.name ?? undefined;
  const userInitial = session?.user?.name?.[0]?.toUpperCase() ?? "U";

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "1.5rem 1rem", display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem", alignItems: "flex-start" }} className="buyer-grid">

        <BuyerSidebar userName={userName} userInitial={userInitial} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#0F172A" }}>Paramètres</h1>

          <div style={{ background: "white", borderRadius: 18, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Bell size={16} color="#F97316" />
              </div>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Notifications</h2>
            </div>
            {[
              { key: "orders" as const, label: "Statut des commandes", sub: "Reçu, en route, livré…" },
              { key: "promos" as const, label: "Promotions et offres", sub: "Réductions et bons plans" },
              { key: "news" as const, label: "Newsletter", sub: "Nouvelles recettes et cuisiniers" },
              { key: "sms" as const, label: "SMS", sub: "Alertes par SMS" },
            ].map((item, i, arr) => (
              <div key={item.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0", gap: "0.75rem", borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A" }}>{item.label}</div>
                  <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: 2 }}>{item.sub}</div>
                </div>
                <Toggle on={notifs[item.key]} onToggle={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key] }))} />
              </div>
            ))}
          </div>

          <div style={{ background: "white", borderRadius: 18, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#F0FDFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Settings size={16} color="#0D9488" />
              </div>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Préférences</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "0.4rem" }}>Langue</label>
                <select value={lang} onChange={e => setLang(e.target.value)} style={{ width: "100%", maxWidth: 280, height: 42, padding: "0 0.875rem", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: "14px", color: "#0F172A", background: "white", outline: "none" }}>
                  <option value="fr">Français</option>
                  <option value="ar">العربية</option>
                  <option value="kab">Tamazight</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "0.4rem" }}>Devise</label>
                <div style={{ height: 42, padding: "0 0.875rem", borderRadius: 10, border: "1.5px solid #E2E8F0", fontSize: "14px", color: "#0F172A", background: "#F8FAFC", display: "flex", alignItems: "center", maxWidth: 280 }}>
                  Dinar algérien (DA)
                </div>
              </div>
            </div>
          </div>

          <SecuritySection twoFactorEnabled={twoFactorEnabled} onTwoFactorToggle={handleTwoFactorToggle} />

          <div style={{ background: "white", borderRadius: 18, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1.5px solid #FEE2E2" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.875rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={16} color="#EF4444" />
              </div>
              <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#EF4444", margin: 0 }}>Zone danger</h2>
            </div>
            <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "1rem", lineHeight: 1.6 }}>
              La suppression de votre compte est définitive. Toutes vos commandes, favoris et données seront effacés.
            </p>
            <button onClick={() => setDeleteModal(true)} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", height: 40, padding: "0 1rem", borderRadius: 10, background: "transparent", border: "2px solid #EF4444", color: "#EF4444", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              <Trash2 size={14} /> Supprimer mon compte
            </button>
          </div>
        </div>
      </div>

      {deleteModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: 18, padding: "1.5rem", maxWidth: 380, width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <AlertTriangle size={24} color="#EF4444" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", textAlign: "center", marginBottom: "0.5rem" }}>Supprimer le compte ?</h3>
            <p style={{ fontSize: "13px", color: "#64748B", textAlign: "center", lineHeight: 1.6, marginBottom: "1.5rem" }}>
              Cette action est irréversible. Toutes vos données seront supprimées définitivement.
            </p>
            <div style={{ display: "flex", gap: "0.625rem" }}>
              <button onClick={() => setDeleteModal(false)} style={{ flex: 1, height: 44, borderRadius: 10, border: "1.5px solid #E2E8F0", background: "white", fontSize: "14px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>
                Annuler
              </button>
              <button style={{ flex: 1, height: 44, borderRadius: 10, background: "#EF4444", border: "none", fontSize: "14px", fontWeight: 700, color: "white", cursor: "pointer" }}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .buyer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
