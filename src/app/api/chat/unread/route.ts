import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ count: 0, conversations: [] });
  }

  const userId = session.user.id;
  const { searchParams } = new URL(req.url);
  const includeConversations = searchParams.get("include") === "conversations";

  const count = await prisma.chatMessage.count({
    where: {
      read: false,
      isDeleted: false,
      senderId: { not: userId },
      order: {
        OR: [
          { customerId: userId },
          { cookId: userId },
        ],
      },
    },
  });

  if (!includeConversations) {
    return NextResponse.json({ count });
  }

  const metaRows = await prisma.orderChatMeta.findMany({
    where: {
      order: {
        OR: [{ customerId: userId }, { cookId: userId }],
      },
    },
    include: {
      order: {
        select: { id: true, customerId: true, cookId: true },
      },
      lastMessageSender: {
        select: { id: true, name: true },
      },
    },
    orderBy: { lastMessageAt: { sort: "desc", nulls: "last" } },
    take: 10,
  });

  const conversations = await Promise.all(
    metaRows
      .filter((m) => m.lastMessageAt)
      .map(async (meta) => {
        const otherUserId =
          meta.order.customerId === userId
            ? meta.order.cookId
            : meta.order.customerId;
        const otherUser = await prisma.user.findUnique({
          where: { id: otherUserId },
          select: { id: true, name: true, image: true },
        });

        const unreadCount = await prisma.chatMessage.count({
          where: {
            orderId: meta.orderId,
            read: false,
            isDeleted: false,
            senderId: { not: userId },
          },
        });

        return {
          orderId: meta.orderId,
          orderNumber: meta.orderId.substring(0, 8),
          otherUser,
          lastMessagePreview: meta.lastMessagePreview || "",
          lastMessageAt: meta.lastMessageAt?.toISOString() || null,
          lastMessageSenderName: meta.lastMessageSender?.name || null,
          unreadCount,
        };
      })
  );

  return NextResponse.json({ count, conversations });
}
