"use client";

import { useState } from "react";
import { Shield, ChevronRight, Check } from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";
import TwoFactorSetupModal from "./TwoFactorSetupModal";
import SessionsModal from "./SessionsModal";

interface SecuritySectionProps {
  twoFactorEnabled: boolean;
  onTwoFactorToggle: () => void;
}

export default function SecuritySection({ twoFactorEnabled, onTwoFactorToggle }: SecuritySectionProps) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showSessionsModal, setShowSessionsModal] = useState(false);

  const items = [
    {
      label: "Changer le mot de passe",
      description: "Modifiez votre mot de passe actuel",
      onClick: () => setShowPasswordModal(true),
      badge: null,
    },
    {
      label: "Vérification en 2 étapes",
      description: twoFactorEnabled ? "Activée — sécurisez votre compte" : "Ajoutez une couche de sécurité",
      onClick: () => setShow2FAModal(true),
      badge: twoFactorEnabled ? (
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 20, background: "#F0FDF4", color: "#22C55E", fontSize: "12px", fontWeight: 600 }}>
          <Check size={12} /> Active
        </div>
      ) : null,
    },
    {
      label: "Sessions actives",
      description: "Gérez vos appareils connectés",
      onClick: () => setShowSessionsModal(true),
      badge: null,
    },
  ];

  return (
    <>
      <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1.5rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={18} color="#3B82F6" />
          </div>
          <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Sécurité</h2>
        </div>
        {items.map((item, i, arr) => (
          <button
            key={item.label}
            onClick={item.onClick}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "1rem 0",
              border: "none",
              borderBottom: i < arr.length - 1 ? "1px solid #F1F5F9" : "none",
              background: "none",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#0F172A", marginBottom: 2 }}>{item.label}</div>
              <div style={{ fontSize: "13px", color: "#94A3B8" }}>{item.description}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              {item.badge}
              <ChevronRight size={16} color="#94A3B8" />
            </div>
          </button>
        ))}
      </div>

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      <TwoFactorSetupModal isOpen={show2FAModal} onClose={() => setShow2FAModal(false)} isEnabled={twoFactorEnabled} onToggle={onTwoFactorToggle} />
      <SessionsModal isOpen={showSessionsModal} onClose={() => setShowSessionsModal(false)} />
    </>
  );
}
