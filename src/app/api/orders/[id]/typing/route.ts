import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  const { isTyping } = await req.json();

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

  const { pusher, channels } = await import("@/lib/pusher");

  try {
    await pusher.trigger(channels.order(orderId), "typing", {
      userId,
      isTyping,
      senderName: session.user.name,
    });
  } catch (e) {
    console.error("Pusher typing error:", e);
  }

  return NextResponse.json({ success: true });
}
