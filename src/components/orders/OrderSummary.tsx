interface OrderSummaryProps {
  createdAt: Date | string;
  type: string;
  totalAmount: number;
  deliveryFee: number;
}

export default function OrderSummary({ createdAt, type, totalAmount, deliveryFee }: OrderSummaryProps) {
  const date = new Date(createdAt);
  const formattedDate = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const subtotal = totalAmount - deliveryFee;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>📝</span>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", margin: 0 }}>Résumé</h3>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          padding: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: 16 }}>📅</span>
          <div>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 2 }}>Date</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B" }}>{formattedDate}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 16 }}>🏠</span>
          <div>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 2 }}>Type</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "#1E293B" }}>
              {type === "DELIVERY" ? "Livraison" : "Retrait"}
            </p>
          </div>
        </div>

        <div style={{ height: 1, background: "#F1F5F9", marginBottom: 16 }} />

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, color: "#64748B" }}>Sous-total</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>
            {subtotal.toLocaleString()} DZD
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: "#64748B" }}>Livraison</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#1E293B" }}>
            {deliveryFee.toLocaleString()} DZD
          </span>
        </div>

        <div style={{ height: 1, background: "#F1F5F9", marginBottom: 16 }} />

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#1E293B" }}>Total</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#F97316" }}>
            {totalAmount.toLocaleString()} DZD
          </span>
        </div>
      </div>
    </div>
  );
}
