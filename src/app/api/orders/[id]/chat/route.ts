import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusher, channels } from "@/lib/pusher";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const orderId = (await params).id;
  const userId = session.user.id;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      OR: [{ customerId: userId }, { cookId: userId }],
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const [messages] = await Promise.all([
    prisma.chatMessage.findMany({
      where: { orderId, isDeleted: false },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        replyTo: {
          include: { sender: { select: { id: true, name: true } } },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    // Mark SENT→DELIVERED for messages from other user
    prisma.chatMessage.updateMany({
      where: { orderId, senderId: { not: userId }, status: "SENT" },
      data: { status: "DELIVERED" },
    }),
    // Mark DELIVERED→READ when user opens chat
    prisma.chatMessage.updateMany({
      where: { orderId, senderId: { not: userId }, status: "DELIVERED" },
      data: { status: "READ", read: true, readAt: new Date() },
    }),
    // Update OrderChatMeta read timestamp
    prisma.orderChatMeta.upsert({
      where: { orderId },
      create: {
        orderId,
        ...(order.customerId === userId
          ? { customerLastReadAt: new Date() }
          : { cookLastReadAt: new Date() }),
      },
      update: {
        ...(order.customerId === userId
          ? { customerLastReadAt: new Date() }
          : { cookLastReadAt: new Date() }),
      },
    }),
  ]);

  return NextResponse.json(messages);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const orderId = (await params).id;
  const userId = session.user.id;
  const { content, type = "TEXT", imageUrl, replyToId, latitude, longitude, locationName } = await req.json();

  const preview = content || (type === "IMAGE" ? "📷 Image" : type === "LOCATION" ? "📍 Localisation" : "");

  if (!content && type !== "IMAGE" && type !== "LOCATION") {
    return NextResponse.json({ error: "Contenu requis" }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      OR: [{ customerId: userId }, { cookId: userId }],
    },
    include: {
      customer: { select: { id: true } },
      cook: { select: { id: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
  }

  const message = await prisma.chatMessage.create({
    data: {
      orderId,
      senderId: userId,
      content: content || "",
      type,
      imageUrl,
      replyToId: replyToId || null,
      latitude: latitude || null,
      longitude: longitude || null,
      locationName: locationName || null,
      status: "DELIVERED",
    },
    include: {
      sender: { select: { id: true, name: true, image: true } },
      replyTo: {
        include: { sender: { select: { id: true, name: true } } },
      },
    },
  });

  // Upsert OrderChatMeta with latest preview
  await prisma.orderChatMeta.upsert({
    where: { orderId },
    create: {
      orderId,
      lastMessagePreview: preview.substring(0, 100),
      lastMessageAt: new Date(),
      lastMessageSenderId: userId,
    },
    update: {
      lastMessagePreview: preview.substring(0, 100),
      lastMessageAt: new Date(),
      lastMessageSenderId: userId,
    },
  });

  try {
    await pusher.trigger(channels.order(orderId), "new-message", { message, orderId });

    const recipientId = order.customerId === userId ? order.cook.id : order.customer.id;
    await pusher.trigger(channels.user(recipientId), "chat-notification", {
      orderId,
      senderName: session.user.name,
      preview: preview.substring(0, 50),
    });
  } catch (e) {
    console.error("Pusher error:", e);
  }

  return NextResponse.json(message);
}
