import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const customerId = session.user.id;
    const body = await req.json();
    const { orderId, cookId, rating, comment } = body;

    if (!orderId || !cookId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    // Check order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { review: true },
    });

    if (!order || order.customerId !== customerId) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    if (order.status !== "COMPLETED") {
      return NextResponse.json({ error: "La commande doit être terminée pour laisser un avis" }, { status: 400 });
    }

    if (order.review) {
      return NextResponse.json({ error: "Un avis existe déjà pour cette commande" }, { status: 400 });
    }

    // Use transaction to create review and update cook's rating
    await prisma.$transaction(async (tx) => {
      await tx.review.create({
        data: {
          customerId,
          cookId,
          orderId,
          rating,
          comment,
        },
      });

      // Calculate new average
      const allReviews = await tx.review.findMany({
        where: { cookId },
        select: { rating: true },
      });

      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      const avgRating = totalRating / allReviews.length;

      await tx.cookProfile.update({
        where: { userId: cookId },
        data: { avgRating },
      });
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: unknown) {
    console.error("Erreur lors de la soumission de l'avis:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
