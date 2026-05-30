"use client";

import { useState } from "react";

interface OrderItemCardProps {
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string | null;
}

export default function OrderItemCard({ name, quantity, price, imageUrl }: OrderItemCardProps) {
  const [imgError, setImgError] = useState(false);
  const total = price * quantity;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "16px 0",
        borderBottom: "1px solid #F1F5F9",
      }}
      className="last:border-b-0"
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 12,
          overflow: "hidden",
          flexShrink: 0,
          background: "#F8FAFC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
        }}
      >
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={() => setImgError(true)}
          />
        ) : (
          "🍽"
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", marginBottom: 2 }}>{name}</p>
        <p style={{ fontSize: 14, color: "#64748B" }}>Quantité: {quantity}</p>
      </div>
      <p style={{ fontSize: 16, fontWeight: 700, color: "#F97316", whiteSpace: "nowrap" }}>
        {total.toLocaleString()} DZD
      </p>
    </div>
  );
}
