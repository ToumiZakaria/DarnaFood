"use client";

import { useState, useCallback } from "react";
import SecuritySection from "@/components/settings/SecuritySection";
import NotificationsSection from "@/components/settings/NotificationsSection";

interface CookSettingsClientProps {
  twoFactorEnabled: boolean;
}

export default function CookSettingsClient({ twoFactorEnabled: initial2FA }: CookSettingsClientProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(initial2FA);

  const handleTwoFactorToggle = useCallback(() => {
    setTwoFactorEnabled(prev => !prev);
  }, []);

  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>
          Paramètres
        </h1>
        <p style={{ color: "#64748B", fontSize: "13px", fontWeight: 400 }}>
          Gérez vos préférences et la sécurité de votre compte
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <SecuritySection twoFactorEnabled={twoFactorEnabled} onTwoFactorToggle={handleTwoFactorToggle} />
        <NotificationsSection />
        <DangerZone />
      </div>
    </div>
  );
}

function DangerZone() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #FEE2E2", overflow: "hidden" }}>
      <div className="cook-danger-header" style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "1.25rem 1.75rem", borderBottom: "1px solid #FEE2E2" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        </div>
        <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#EF4444", margin: 0 }}>Zone danger</h2>
      </div>

      <div className="cook-danger-body" style={{ padding: "1.75rem" }}>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "1.25rem", lineHeight: 1.7 }}>
          La suppression de votre compte est définitive. Toutes vos commandes, plats, avis et données seront effacés.
        </p>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="cook-danger-btn"
            style={{ height: 44, padding: "0 1.5rem", borderRadius: 12, background: "transparent", border: "2px solid #FEE2E2", color: "#EF4444", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            Supprimer mon compte
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#EF4444", margin: 0 }}>
              Êtes-vous sûr ? Cette action est irréversible.
            </p>
            <div className="cook-danger-actions" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="cook-danger-btn"
                style={{ height: 44, padding: "0 1.5rem", borderRadius: 12, background: "transparent", border: "1.5px solid #E2E8F0", color: "#475569", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
              >
                Annuler
              </button>
              <button
                className="cook-danger-btn"
                style={{ height: 44, padding: "0 1.5rem", borderRadius: 12, background: "#EF4444", border: "none", color: "white", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
              >
                Oui, supprimer définitivement
              </button>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .cook-danger-header { padding: 1rem 1.25rem !important; }
          .cook-danger-body { padding: 1.25rem !important; }
          .cook-danger-btn { flex: 1 !important; min-width: 0 !important; padding: 0 0.75rem !important; font-size: 13px !important; }
          .cook-danger-actions { width: 100% !important; }
        }
      `}</style>
    </div>
  );
}
