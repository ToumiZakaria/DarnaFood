import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BuyerOrdersClient from "./BuyerOrdersClient";

export const metadata = {
  title: "Mes commandes | DarnaFood",
};

export default async function BuyerOrdersPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/auth/login");
  }

  const userId = session.user.id;

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: {
        customerId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        review: true,
        cook: {
          select: {
            id: true,
            name: true,
          },
        },
        items: {
          include: {
            dish: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error loading customer orders from database:", error);
  }

  return <BuyerOrdersClient initialOrders={orders} />;
}
