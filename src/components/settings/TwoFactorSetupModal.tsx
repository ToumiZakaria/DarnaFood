"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { X, Shield, Loader2, Smartphone, Copy, Check, AlertTriangle } from "lucide-react";
import Image from "next/image";

interface TwoFactorSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEnabled: boolean;
  onToggle: () => void;
}

export default function TwoFactorSetupModal({ isOpen, onClose, isEnabled, onToggle }: TwoFactorSetupModalProps) {
  const [step, setStep] = useState<"menu" | "setup" | "verify" | "codes" | "disable">("menu");
  const [qrcode, setQrcode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep("menu");
      setQrcode("");
      setSecret("");
      setToken("");
      setBackupCodes([]);
      setPassword("");
      setCopied(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSetup() {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/2fa/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQrcode(data.qrcode);
      setSecret(data.secret);
      setStep("verify");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify() {
    if (!token) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBackupCodes(data.backupCodes || []);
      setStep("codes");
      onToggle();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDisable() {
    if (!password) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("2FA désactivée");
      onToggle();
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function copyCodes() {
    navigator.clipboard.writeText(backupCodes.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const header = (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#EFF6FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Shield size={20} color="#3B82F6" />
      </div>
      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: 0 }}>
        {isEnabled ? "Désactiver la 2FA" : "Vérification en 2 étapes"}
      </h3>
    </div>
  );

  if (isEnabled) {
    return (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
        <div style={{ background: "white", borderRadius: 20, padding: "2rem", maxWidth: 420, width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            {header}
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#94A3B8" }}>
              <X size={20} />
            </button>
          </div>
          <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "1.5rem", lineHeight: 1.7 }}>
            Saisissez votre mot de passe pour désactiver la vérification en 2 étapes.
          </p>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
            style={{
              width: "100%",
              height: 48,
              borderRadius: 12,
              border: "1.5px solid #E2E8F0",
              padding: "0 1rem",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              marginBottom: "1rem",
            }}
          />
          <button
            onClick={handleDisable}
            disabled={isSubmitting || !password}
            style={{
              width: "100%",
              height: 48,
              borderRadius: 12,
              background: "#EF4444",
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
            {isSubmitting ? "Désactivation..." : "Désactiver la 2FA"}
          </button>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "2rem", maxWidth: 460, width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {header}
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#94A3B8" }}>
            <X size={20} />
          </button>
        </div>

        {step === "menu" && (
          <>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Ajoutez une couche de sécurité supplémentaire à votre compte. Vous devrez saisir un code généré par votre application d'authentification à chaque connexion.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "#FFFBEB", borderRadius: 12, border: "1px solid #FDE68A", marginBottom: "1.5rem" }}>
              <Smartphone size={24} color="#F97316" />
              <p style={{ fontSize: "13px", color: "#92400E", margin: 0, lineHeight: 1.5 }}>
                Vous aurez besoin d'une application comme Google Authenticator, Authy ou Microsoft Authenticator.
              </p>
            </div>
            <button
              onClick={handleSetup}
              disabled={isSubmitting}
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
              {isSubmitting ? "Génération..." : "Configurer la 2FA"}
            </button>
          </>
        )}

        {step === "verify" && (
          <>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "1.5rem", lineHeight: 1.7 }}>
              Scannez ce code QR avec votre application d'authentification, puis saisissez le code à 6 chiffres généré.
            </p>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
              {qrcode && (
                <Image src={qrcode} alt="QR Code" width={180} height={180} style={{ borderRadius: 12 }} />
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", marginBottom: "1.5rem" }}>
              <code style={{ fontSize: "13px", color: "#64748B", background: "#F1F5F9", padding: "0.375rem 0.75rem", borderRadius: 8, letterSpacing: 1 }}>{secret}</code>
              <button onClick={() => { navigator.clipboard.writeText(secret); toast.success("Copié !"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 4 }}>
                <Copy size={16} />
              </button>
            </div>
            <input
              type="text"
              value={token}
              onChange={e => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Code à 6 chiffres"
              maxLength={6}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 12,
                border: "1.5px solid #E2E8F0",
                padding: "0 1rem",
                fontSize: "18px",
                textAlign: "center",
                letterSpacing: 8,
                outline: "none",
                boxSizing: "border-box",
                marginBottom: "1rem",
                fontFamily: "monospace",
              }}
            />
            <button
              onClick={handleVerify}
              disabled={isSubmitting || token.length < 6}
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
              {isSubmitting ? "Vérification..." : "Vérifier et activer"}
            </button>
          </>
        )}

        {step === "codes" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", background: "#F0FDF4", borderRadius: 12, border: "1px solid #BBF7D0", marginBottom: "1rem" }}>
              <Check size={16} color="#22C55E" />
              <p style={{ fontSize: "13px", color: "#166534", margin: 0 }}>2FA activée avec succès !</p>
            </div>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "1rem", lineHeight: 1.7 }}>
              Conservez ces codes de secours en lieu sûr. Chaque code ne peut être utilisé qu'une seule fois.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginBottom: "1rem" }}>
              {backupCodes.map(code => (
                <div key={code} style={{ padding: "0.5rem", background: "#F8FAFC", borderRadius: 8, border: "1px solid #F1F5F9", fontSize: "13px", fontFamily: "monospace", textAlign: "center", color: "#0F172A", letterSpacing: 1 }}>
                  {code}
                </div>
              ))}
            </div>
            <button
              onClick={copyCodes}
              style={{
                width: "100%",
                height: 44,
                borderRadius: 12,
                background: "white",
                border: "1.5px solid #E2E8F0",
                fontSize: "14px",
                fontWeight: 600,
                color: "#475569",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              {copied ? <Check size={16} color="#22C55E" /> : <Copy size={16} />}
              {copied ? "Copié !" : "Copier les codes"}
            </button>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                height: 48,
                borderRadius: 12,
                background: "#F97316",
                border: "none",
                fontSize: "15px",
                fontWeight: 600,
                color: "white",
                cursor: "pointer",
              }}
            >
              Terminé
            </button>
          </>
        )}

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
