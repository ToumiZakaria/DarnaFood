"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface OrderReviewProps {
  orderId: string;
  cookId: string;
  existingReview?: { rating: number; comment: string | null } | null;
}

export default function OrderReview({ orderId, cookId, existingReview }: OrderReviewProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(!!existingReview);
  const router = useRouter();

  if (existingReview) {
    return (
      <div
        style={{
          background: "#F8FAFC",
          borderRadius: 16,
          border: "1px solid #E2E8F0",
          padding: 20,
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1E293B", marginBottom: 10 }}>Votre avis</h3>
        <div style={{ display: "flex", gap: 2, marginBottom: 8 }}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              style={{ color: i < existingReview.rating ? "#F59E0B" : "#E2E8F0", fill: i < existingReview.rating ? "#F59E0B" : "none" }}
            />
          ))}
        </div>
        {existingReview.comment && (
          <p style={{ fontSize: 14, color: "#64748B", fontStyle: "italic" }}>
            &ldquo;{existingReview.comment}&rdquo;
          </p>
        )}
      </div>
    );
  }

  if (submitted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, cookId, rating, comment }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue");
      }

      toast.success("Avis publié avec succès !");
      setSubmitted(true);
      router.refresh();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: "#FFF7ED",
        borderRadius: 16,
        border: "1px solid #FED7AA",
        padding: 20,
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 700, color: "#9A3412", marginBottom: 8 }}>
        Évaluez votre commande
      </h3>
      <p style={{ fontSize: 14, color: "#C2410C", marginBottom: 16 }}>
        Qu&apos;avez-vous pensé du repas ?
      </p>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 6, display: "block" }}>
            Note
          </label>
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                style={{
                  background: "none", border: "none", cursor: "pointer", padding: 2,
                  color: rating >= star ? "#F59E0B" : "#E2E8F0",
                  transition: "color 150ms",
                }}
              >
                <Star size={28} fill="currentColor" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#1E293B", marginBottom: 6, display: "block" }}>
            Commentaire (optionnel)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Qu'avez-vous pensé du repas ?"
            style={{
              width: "100%", minHeight: 80, padding: "10px 14px",
              borderRadius: 12, border: "1.5px solid #E2E8F0",
              fontSize: 14, fontFamily: "inherit", color: "#1E293B",
              outline: "none", resize: "vertical",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#F97316")}
            onBlur={(e) => (e.target.style.borderColor = "#E2E8F0")}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            height: 44, padding: "0 20px", borderRadius: 12,
            background: "#F97316", color: "#FFFFFF", border: "none",
            fontSize: 15, fontWeight: 600, cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.6 : 1,
            transition: "all 150ms",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          {isSubmitting ? "Envoi..." : "Publier l'avis"}
        </button>
      </form>
    </div>
  );
}
