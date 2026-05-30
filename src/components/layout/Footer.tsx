"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChefHat, Mail, Phone, MapPin, Globe, Share2, Send } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");

  if (pathname.startsWith("/cook")) return null;

  return (
    <footer style={{ background: "#0F172A", paddingTop: "4rem" }}>

      {/* ── Main Grid ── */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem 3rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2rem" }} className="footer-grid">

        {/* Col 1 — Brand */}
        <div>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.625rem", textDecoration: "none", marginBottom: "1rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ChefHat size={22} color="white" />
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", color: "white", letterSpacing: "-0.02em" }}>
              Darna<span style={{ color: "#F97316" }}>Food</span>
            </span>
          </Link>
          <p style={{ fontSize: "14px", lineHeight: 1.7, color: "rgba(255,255,255,0.55)", maxWidth: 220 }}>
            Le premier marketplace de cuisine algérienne. Des plats faits maison, livrés chez vous.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
            {[
              { href: "https://facebook.com", label: "Facebook", icon: Globe },
              { href: "https://instagram.com", label: "Instagram", icon: Share2 },
              { href: "https://wa.me/", label: "WhatsApp", icon: Send },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.45)", textDecoration: "none", transition: "all 200ms" }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.9)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
              >
                <s.icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Col 2 — Clients */}
        <div>
          <h4 style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.9)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>Clients</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { href: "/#how-it-works", label: "Comment commander" },
              { href: "/faq#paiement", label: "Paiement" },
              { href: "/faq#livraison", label: "Livraison" },
              { href: "/faq", label: "FAQ" },
              { href: "/support", label: "Support" },
            ].map(l => (
              <li key={l.label}>
                <Link href={l.href} style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 150ms" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3 — Cuisiniers */}
        <div>
          <h4 style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.9)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>Cuisiniers</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { href: "/auth/register", label: "Devenir cuisinier" },
              { href: "/pricing", label: "Tarifs" },
              { href: "/tips", label: "Conseils" },
              { href: "/rules", label: "Règles" },
              { href: "/help", label: "Centre d'aide" },
            ].map(l => (
              <li key={l.label}>
                <Link href={l.href} style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", textDecoration: "none", transition: "color 150ms" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.9)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4 — Contact + Newsletter */}
        <div>
          <h4 style={{ fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.9)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>Contact</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
            {[
              { icon: Mail, text: "contact@darnafood.dz" },
              { icon: Phone, text: "+213 555 123 456" },
              { icon: MapPin, text: "Alger, Algérie" },
            ].map(item => (
              <li key={item.text} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "14px", color: "rgba(255,255,255,0.55)" }}>
                <item.icon size={15} style={{ flexShrink: 0 }} />
                {item.text}
              </li>
            ))}
          </ul>

          {/* Newsletter */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input
              type="email"
              placeholder="Votre email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ flex: 1, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", padding: "0 0.875rem", fontSize: "14px", color: "white", outline: "none" }}
            />
            <button
              onClick={() => { setEmail(""); }}
              style={{ width: 44, height: 44, borderRadius: 12, background: "#F97316", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#EA580C")}
              onMouseLeave={e => (e.currentTarget.style.background = "#F97316")}
              aria-label="S'abonner"
            >
              <Send size={18} color="white" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1.5rem 1.5rem" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}>
            © 2025 DarnaFood. Tous droits réservés.
          </p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { href: "/legal/terms", label: "CGU" },
              { href: "/legal/privacy", label: "Confidentialité" },
              { href: "/legal/cookies", label: "Cookies" },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", textDecoration: "none", transition: "color 150ms" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}
