import Link from "next/link";
import React from "react";

export function EmptyState({
  emoji = "🍽️",
  title = "Aucun élément",
  subtitle = "Rien à afficher pour le moment.",
  ctaText,
  ctaHref,
  ctaIcon: Icon,
}: {
  emoji?: string;
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  ctaIcon?: React.ElementType;
}) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "4rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "var(--primary-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "60px",
          marginBottom: "1rem",
        }}
      >
        {emoji}
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "22px",
          fontWeight: 700,
          color: "#0F172A",
          margin: 0,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: "15px",
          fontWeight: 400,
          color: "#64748B",
          maxWidth: "28rem",
          margin: "0.5rem auto 0",
          lineHeight: 1.6,
        }}
      >
        {subtitle}
      </p>
      {ctaText && ctaHref && (
        <Link href={ctaHref} className="btn btn-primary" style={{ marginTop: "1.5rem", height: 48, borderRadius: "12px", padding: "0 24px", fontSize: "15px" }}>
          {Icon && <Icon size={18} />} {ctaText}
        </Link>
      )}
    </div>
  );
}
