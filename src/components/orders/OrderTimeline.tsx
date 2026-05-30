"use client";

import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  { key: "PENDING", label: "Commande placée" },
  { key: "CONFIRMED", label: "Acceptée" },
  { key: "PREPARING", label: "En préparation" },
  { key: "READY", label: "Prête" },
  { key: "COMPLETED", label: "Terminée" },
];

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Cette commande est en attente de confirmation.",
  CONFIRMED: "Cette commande a été confirmée par le cuisinier.",
  PREPARING: "Le cuisinier prépare votre commande.",
  READY: "Votre commande est prête !",
  DELIVERING: "Votre commande est en cours de livraison.",
  COMPLETED: "Cette commande a été terminée avec succès.",
  CANCELLED: "Cette commande a été annulée.",
};

const STATUS_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  PENDING:    { bg: "#FEF3C7", text: "#B45309", label: "En attente" },
  CONFIRMED:  { bg: "#DBEAFE", text: "#1D4ED8", label: "Confirmée" },
  PREPARING:  { bg: "#FFEDD5", text: "#C2410C", label: "En préparation" },
  READY:      { bg: "#D1FAE5", text: "#047857", label: "Prête" },
  DELIVERING: { bg: "#F3E8FF", text: "#6D28D9", label: "En livraison" },
  COMPLETED:  { bg: "#D1FAE5", text: "#15803D", label: "Terminée" },
  CANCELLED:  { bg: "#FEE2E2", text: "#DC2626", label: "Annulée" },
};

interface OrderTimelineProps {
  orderId: string;
  currentStatus: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  customerId: string;
  orderType: string;
}

export default function OrderTimeline({
  orderId, currentStatus, createdAt, updatedAt, customerId, orderType,
}: OrderTimelineProps) {
  const [status, setStatus] = useState(currentStatus);

  useEffect(() => {
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      authEndpoint: "/api/pusher/auth",
    });

    const channel = pusher.subscribe(`private-customer-${customerId}`);

    channel.bind("order-status-changed", (data: { orderId: string; status: string }) => {
      if (data.orderId === orderId) {
        setStatus(data.status);
      }
    });

    return () => {
      pusher.unsubscribe(`private-customer-${customerId}`);
    };
  }, [customerId, orderId]);

  const isCancelled = status === "CANCELLED";
  const badge = STATUS_BADGE[status] || STATUS_BADGE.PENDING;

  const displaySteps = orderType === "DELIVERY"
    ? [...STEPS.slice(0, 4), { key: "DELIVERING", label: "En livraison" }, { key: "COMPLETED", label: "Livrée" }]
    : STEPS;

  const currentStepIndex = displaySteps.findIndex((s) => s.key === status);
  const isCompleted = status === "COMPLETED";
  const completedSteps = isCompleted ? displaySteps.length : (currentStepIndex >= 0 ? currentStepIndex : -1);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12, marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1E293B", margin: 0, letterSpacing: "-0.02em" }}>
            Commande #{orderId.slice(-6).toUpperCase()}
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", marginTop: 4 }}>Suivi de commande</p>
        </div>
        <span
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "6px 14px", fontSize: 13, fontWeight: 600,
            borderRadius: 9999, background: badge.bg, color: badge.text,
            whiteSpace: "nowrap",
          }}
        >
          {badge.label}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>
        {isCancelled
          ? "Cette commande a été annulée."
          : STATUS_LABELS[status] || STATUS_LABELS.PENDING}
      </p>

      {/* Section Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <span style={{ fontSize: 18 }}>📍</span>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", margin: 0 }}>Statut de la commande</h3>
      </div>

      {/* Timeline */}
      {isCancelled ? (
        <div
          style={{
            background: "#FEF2F2", color: "#DC2626",
            padding: "16px 20px", borderRadius: 12,
            fontWeight: 600, fontSize: 14, textAlign: "center",
          }}
        >
          Commande annulée le {format(new Date(updatedAt), "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
        </div>
      ) : (
        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            padding: 24,
          }}
        >
          {displaySteps.map((step, index) => {
            const isDone = index < completedSteps;
            const isCurrent = index === completedSteps;

            return (
              <div key={step.key} style={{ display: "flex", gap: 16, position: "relative" }}>
                {/* Connector line */}
                {index < displaySteps.length - 1 && (
                  <div
                    style={{
                      position: "absolute", left: 17, top: 34,
                      width: 2, height: "calc(100% - 10px)",
                      background: isDone ? "#F97316" : "#E2E8F0",
                    }}
                  />
                )}

                {/* Circle */}
                <div
                  style={{
                    width: 36, height: 36, borderRadius: "50%", flexShrink: 0, zIndex: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: isDone || isCurrent ? "2px solid #F97316" : "2px solid #E2E8F0",
                    background: isDone ? "#F97316" : isCurrent ? "#FFF7ED" : "#FFFFFF",
                    position: "relative",
                  }}
                >
                  {isDone ? (
                    <Check size={18} color="#FFFFFF" strokeWidth={3} />
                  ) : isCurrent ? (
                    <div
                      style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: "#F97316",
                        animation: "pulse 2s ease infinite",
                      }}
                    />
                  ) : (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#E2E8F0" }} />
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingBottom: index < displaySteps.length - 1 ? 28 : 0 }}>
                  <p
                    style={{
                      fontSize: 15, fontWeight: isDone || isCurrent ? 700 : 500,
                      color: isDone || isCurrent ? "#1E293B" : "#94A3B8",
                      marginTop: 6,
                    }}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <p style={{ fontSize: 13, color: "#F97316", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                      <Loader2 size={12} className="animate-spin" />
                      En cours
                    </p>
                  )}
                  {isDone && index === 0 && (
                    <p style={{ fontSize: 13, color: "#94A3B8", marginTop: 2 }}>
                      {format(new Date(createdAt), "dd/MM HH:mm", { locale: fr })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
