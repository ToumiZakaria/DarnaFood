"use client";

import Link from "next/link";
import { CheckCircle, MapPin, Clock, Phone, ArrowRight, Home } from "lucide-react";

const STEPS = [
  { label: "Commande reçue", done: true },
  { label: "En préparation", done: false },
  { label: "En route", done: false },
  { label: "Livrée", done: false },
];

export default function OrderConfirmPage() {
  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "3rem 1.5rem 4rem", textAlign: "center" }}>

        {/* Success Icon */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: "1.5rem" }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: "#0D9488", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", boxShadow: "0 0 0 16px rgba(13,148,136,0.1)", animation: "scaleIn 400ms ease" }}>
            <CheckCircle size={44} color="white" fill="rgba(255,255,255,0.2)" />
          </div>
          {/* Confetti dots */}
          {[
            { top: "-10px", right: "0px", bg: "#F97316" },
            { top: "-5px", left: "-10px", bg: "#FBBF24" },
            { bottom: "5px", right: "-12px", bg: "#0D9488" },
            { bottom: "-8px", left: "5px", bg: "#3B82F6" },
            { top: "30%", right: "-18px", bg: "#F97316" },
            { top: "20%", left: "-18px", bg: "#FBBF24" },
          ].map((dot, i) => (
            <div key={i} style={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", background: dot.bg, ...dot }} />
          ))}
        </div>

        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.75rem" }}>
          Commande confirmée !
        </h1>
        <p style={{ fontSize: "16px", color: "#64748B", lineHeight: 1.7, marginBottom: "2rem" }}>
          Merci pour votre commande. <strong>Fatima B.</strong> a été notifiée et prépare votre repas.
        </p>

        {/* Order card */}
        <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", textAlign: "left", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid #F1F5F9", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem", paddingBottom: "1.25rem", borderBottom: "1px solid #F1F5F9" }}>
            <div>
              <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: 4 }}>Numéro de commande</div>
              <div style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A" }}>#DF-0892</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: 4 }}>Date</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#475569" }}>
                {new Date().toLocaleDateString("fr-DZ", { day: "2-digit", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "#64748B" }}>Couscous Kabyle × 2</span>
              <span style={{ fontWeight: 600, color: "#0F172A" }}>1 700 DA</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "#64748B" }}>Chorba Frik × 1</span>
              <span style={{ fontWeight: 600, color: "#0F172A" }}>350 DA</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "#64748B" }}>Livraison</span>
              <span style={{ fontWeight: 600, color: "#0F172A" }}>200 DA</span>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "1rem", borderTop: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>Total</span>
            <span style={{ fontSize: "22px", fontWeight: 800, color: "#F97316" }}>2 300 DA</span>
          </div>
        </div>

        {/* Delivery info */}
        <div style={{ background: "#FFF7ED", border: "1px solid #FDE68A", borderRadius: 16, padding: "1.25rem 1.5rem", textAlign: "left", marginBottom: "1.75rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <Clock size={16} color="#0D9488" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "14px", fontWeight: 700, color: "#0D9488" }}>Livraison estimée : 45–60 min</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <MapPin size={16} color="#F97316" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "14px", color: "#475569" }}>Tizi Ouzou, Quartier Akbou</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
              <Phone size={16} color="#64748B" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: "14px", color: "#475569" }}>Fatima B. · +213 07 XX XX XX</span>
            </div>
          </div>
        </div>

        {/* Progress tracker */}
        <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {STEPS.map((step, i) => (
              <div key={step.label} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "none" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: step.done ? "#F97316" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 300ms" }}>
                    {step.done ? (
                      <CheckCircle size={16} color="white" />
                    ) : (
                      <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#CBD5E1" }} />
                    )}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: step.done ? 700 : 500, color: step.done ? "#F97316" : "#94A3B8", textAlign: "center", maxWidth: 70, lineHeight: 1.3 }}>
                    {step.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: step.done ? "#F97316" : "#E2E8F0", margin: "0 0.5rem", marginBottom: "1.5rem" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/dashboard/buyer/orders" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", height: 48, padding: "0 1.5rem", borderRadius: 12, background: "#F97316", color: "white", textDecoration: "none", fontSize: "15px", fontWeight: 700 }}>
            Suivre ma commande <ArrowRight size={16} />
          </Link>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", height: 48, padding: "0 1.5rem", borderRadius: 12, border: "1.5px solid #E2E8F0", color: "#475569", textDecoration: "none", fontSize: "15px", fontWeight: 600, background: "white" }}>
            <Home size={16} /> Retour à l&apos;accueil
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
