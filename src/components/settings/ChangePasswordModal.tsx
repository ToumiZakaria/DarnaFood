"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { X, Lock, Eye, EyeOff, Loader2, Check } from "lucide-react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const requirements = [
    { label: "8 caractères minimum", met: newPassword.length >= 8 },
    { label: "Une lettre majuscule", met: /[A-Z]/.test(newPassword) },
    { label: "Un chiffre", met: /\d/.test(newPassword) },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Mot de passe modifié avec succès");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        onClose();
      }, 1500);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputStyle = (show: boolean) => ({
    width: "100%" as const,
    height: 48,
    borderRadius: 12,
    border: "1.5px solid #E2E8F0",
    padding: "0 2.75rem 0 1rem",
    fontSize: "14px",
    color: "#0F172A",
    background: "white",
    outline: "none",
    boxSizing: "border-box" as const,
  });

  const toggleStyle = {
    position: "absolute" as const,
    right: 12,
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 0,
    color: "#94A3B8",
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "2rem", maxWidth: 460, width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#FFF7ED", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Lock size={20} color="#F97316" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Changer le mot de passe</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#94A3B8" }}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
              <Check size={32} color="#22C55E" />
            </div>
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#0F172A" }}>Mot de passe modifié !</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Mot de passe actuel</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Votre mot de passe actuel"
                  style={inputStyle(showCurrent)}
                  required
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} style={toggleStyle}>
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Nouveau mot de passe</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Nouveau mot de passe"
                  style={inputStyle(showNew)}
                  required
                  minLength={8}
                />
                <button type="button" onClick={() => setShowNew(!showNew)} style={toggleStyle}>
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem", marginBottom: "1rem", padding: "0.75rem 1rem", background: "#F8FAFC", borderRadius: 12, border: "1px solid #F1F5F9" }}>
              {requirements.map(req => (
                <div key={req.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "13px", color: req.met ? "#22C55E" : "#94A3B8" }}>
                  {req.met ? <Check size={14} /> : <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid #CBD5E1" }} />}
                  {req.label}
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Confirmer le mot de passe</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Confirmer le mot de passe"
                  style={inputStyle(showConfirm)}
                  required
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={toggleStyle}>
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p style={{ fontSize: "12px", color: "#EF4444", marginTop: 4 }}>Les mots de passe ne correspondent pas</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || newPassword !== confirmPassword || newPassword.length < 8}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 12,
                background: "#F97316",
                border: "none",
                fontSize: "15px",
                fontWeight: 600,
                color: "white",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                opacity: isSubmitting ? 0.8 : 1,
              }}
            >
              {isSubmitting ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : null}
              {isSubmitting ? "Modification..." : "Modifier le mot de passe"}
            </button>
          </form>
        )}

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
