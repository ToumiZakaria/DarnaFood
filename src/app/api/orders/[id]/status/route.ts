import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusher, channels } from "@/lib/pusher";

const VALID_STATUS_FLOW: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY", "CANCELLED"],
  READY: ["DELIVERING", "COMPLETED", "CANCELLED"],
  DELIVERING: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Nouvelle",
  CONFIRMED: "Confirmée",
  PREPARING: "En préparation",
  READY: "Prête",
  DELIVERING: "En livraison",
  COMPLETED: "Livrée",
  CANCELLED: "Annulée",
};

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "COOK") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id: orderId } = await params;
    const { status: newStatus } = await req.json();

    if (!newStatus) {
      return NextResponse.json({ error: "Statut manquant" }, { status: 400 });
    }

    // Verify ownership and current status
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: { select: { id: true } },
      },
    });
    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }
    if (order.cookId !== session.user.id) {
      return NextResponse.json({ error: "Ce n'est pas votre commande" }, { status: 403 });
    }

    // Validate state transition strictly
    const currentStatus = order.status;
    const allowedNext = VALID_STATUS_FLOW[currentStatus] || [];
    if (!allowedNext.includes(newStatus)) {
      return NextResponse.json({
        error: "Transition de statut invalide",
        current: currentStatus,
        requested: newStatus,
        allowed: allowedNext,
      }, { status: 400 });
    }

    // Notification mapping
    let notifMessage = `Votre commande a été mise à jour: ${STATUS_LABELS[newStatus]?.toLowerCase() || newStatus}`;
    let notifLink = `/dashboard/orders/${order.id}`;
    const statusMessages: Record<string, string> = {
      CONFIRMED: "Le cuisinier a accepté votre commande !",
      PREPARING: "Votre repas est en cours de préparation.",
      READY: "Votre commande est prête ! Le livreur arrive bientôt.",
      DELIVERING: "Le livreur est en route !",
      COMPLETED: "Votre commande est terminée. Bon appétit !",
      CANCELLED: "Votre commande a été annulée.",
    };
    if (statusMessages[newStatus]) {
      notifMessage = statusMessages[newStatus];
    }
    if (newStatus === "COMPLETED") {
      notifLink = `/dashboard/orders/${order.id}?review=1`;
    }

    // Update in DB and create notification in transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const updated = await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      });

      await tx.notification.create({
        data: {
          userId: order.customerId,
          type: `ORDER_${newStatus}`,
          message: notifMessage,
          link: notifLink,
        },
      });

      // Create system message in chat for meaningful status changes
      const chatStatusLabels: Record<string, string> = {
        CONFIRMED: `Commande confirmée par ${session.user.name}`,
        PREPARING: "Commande en préparation",
        READY: "Commande prête !",
        DELIVERING: "Commande en livraison",
        COMPLETED: "Commande livrée — Bon appétit !",
        CANCELLED: "Commande annulée",
      };
      if (chatStatusLabels[newStatus]) {
        await tx.chatMessage.create({
          data: {
            orderId,
            senderId: null,
            content: chatStatusLabels[newStatus],
            type: "SYSTEM",
          },
        });
      }

      return updated;
    });

    // Notify Customer via Pusher (fire and forget)
    try {
      await pusher.trigger(channels.customer(order.customerId), "order-status-changed", {
        orderId: order.id,
        status: updatedOrder.status,
      });
      await pusher.trigger(channels.user(order.customerId), "notification", {
        id: `status-${order.id}-${Date.now()}`,
        type: `ORDER_${newStatus}`,
        message: notifMessage,
        link: notifLink,
        createdAt: new Date().toISOString(),
        read: false,
      });
    } catch (pusherError) {
      console.error("Pusher error:", pusherError);
    }

    return NextResponse.json({
      success: true,
      status: updatedOrder.status,
      statusLabel: STATUS_LABELS[newStatus] || newStatus,
    }, { status: 200 });

  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
