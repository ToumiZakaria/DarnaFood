import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusher, channels, events } from "@/lib/pusher";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const customerId = session.user.id;
    const body = await req.json();

    const { cookId, items, type, totalAmount, deliveryFee, deliveryAddress, notes } = body;

    if (!cookId || !items || items.length === 0 || !type || !totalAmount) {
      return NextResponse.json({ error: "Données manquantes ou invalides" }, { status: 400 });
    }

    // Use a transaction to create Order and OrderItems
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId,
          cookId,
          type,
          totalAmount,
          deliveryFee: deliveryFee || 0,
          deliveryAddress,
          notes,
          status: "PENDING",
          items: {
            create: items.map((item: { dishId: string; quantity: number; priceAtOrder: number }) => ({
              dishId: item.dishId,
              quantity: item.quantity,
              priceAtOrder: item.priceAtOrder,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // Create Notification for the cook
      await tx.notification.create({
        data: {
          userId: cookId,
          type: "NEW_ORDER",
          message: `Nouvelle commande ! ${session.user.name} a commandé pour ${totalAmount} DZD`,
          link: `/cook/orders/${newOrder.id}`,
        },
      });

      // Auto-create system message for order
      await tx.chatMessage.create({
        data: {
          orderId: newOrder.id,
          senderId: null,
          content: `Commande #${newOrder.id.slice(-6)} placée.`,
          type: "SYSTEM",
        },
      });

      return newOrder;
    });

    // Trigger Pusher events in the background (fire and forget)
    try {
      const newOrderPayload = {
        id: order.id,
        customerName: session.user.name,
        total: order.totalAmount,
        items: items.length,
        address: deliveryAddress || "",
      };
      await pusher.trigger(channels.cook(cookId), events.NEW_ORDER, newOrderPayload);
      await pusher.trigger(channels.user(cookId), "notification", {
        id: order.id,
        type: "NEW_ORDER",
        message: `Nouvelle commande ! ${session.user.name} a commandé pour ${totalAmount} DA`,
        link: `/cook/orders/${order.id}`,
        createdAt: new Date().toISOString(),
        read: false,
      });
    } catch (pusherError) {
      console.error("Pusher error:", pusherError);
    }

    return NextResponse.json({ success: true, orderId: order.id }, { status: 201 });
  } catch (error: unknown) {
    console.error("Erreur lors de la création de la commande:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
