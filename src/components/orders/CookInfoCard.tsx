import Link from "next/link";
import ContactButton from "@/components/chat/ContactButton";

interface CookInfoCardProps {
  cookId: string;
  name: string;
  image?: string | null;
  address?: string | null;
  commune?: string | null;
  wilaya?: string | null;
  avgRating: number;
  reviewCount: number;
}

export default function CookInfoCard({
  cookId, name, image, address, commune, wilaya, avgRating, reviewCount,
}: CookInfoCardProps) {
  const initials = name?.slice(0, 2).toUpperCase() ?? "CO";
  const fullAddress = [address, commune, wilaya].filter(Boolean).join(", ");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>👨‍🍳</span>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", margin: 0 }}>Cuisinier</h3>
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
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
          {image ? (
            <img
              src={image}
              alt={name}
              style={{
                width: 56, height: 56, borderRadius: "50%", objectFit: "cover", flexShrink: 0,
              }}
            />
          ) : (
            <div
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg, #F97316, #EA580C)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 18, color: "#FFFFFF", flexShrink: 0,
              }}
            >
              {initials}
            </div>
          )}
          <div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", marginBottom: 2 }}>{name}</p>
            {reviewCount > 0 && (
              <p style={{ fontSize: 14, color: "#64748B", display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ color: "#F59E0B" }}>⭐</span> {avgRating.toFixed(1)} ({reviewCount} avis)
              </p>
            )}
          </div>
        </div>

        {fullAddress && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 14, marginTop: 1 }}>📍</span>
            <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.5 }}>{fullAddress}</p>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <ContactButton
            orderId={cookId}
            recipientName={name}
            recipientAvatar={image}
            variant="button"
            label="Contacter"
          />
          <Link
            href={`/cooks/${cookId}`}
            style={{
              height: 40, padding: "0 16px", borderRadius: 12,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, fontWeight: 600, color: "#64748B",
              background: "transparent", textDecoration: "none",
              transition: "all 150ms",
            }}
            className="hover:bg-gray-100"
          >
            Voir profil
          </Link>
        </div>
      </div>
    </div>
  );
}
