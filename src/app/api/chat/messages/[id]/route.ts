import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pusher, channels } from "@/lib/pusher";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const messageId = (await params).id;
  const userId = session.user.id;

  const message = await prisma.chatMessage.findUnique({
    where: { id: messageId },
    include: { order: { select: { id: true } } },
  });

  if (!message) {
    return NextResponse.json({ error: "Message introuvable" }, { status: 404 });
  }

  if (message.senderId !== userId) {
    return NextResponse.json({ error: "Vous ne pouvez supprimer que vos propres messages" }, { status: 403 });
  }

  await prisma.chatMessage.update({
    where: { id: messageId },
    data: { isDeleted: true, content: "Ce message a été supprimé" },
  });

  try {
    await pusher.trigger(channels.order(message.orderId), "message-deleted", {
      messageId,
      orderId: message.orderId,
    });
  } catch (e) {
    console.error("Pusher error:", e);
  }

  return NextResponse.json({ success: true });
}
