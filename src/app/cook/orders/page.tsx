import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CookOrderManager from "@/components/cook/CookOrderManager";

export const metadata = {
  title: "Commandes | Espace Cuisinier",
};

export default async function CookOrdersPage() {
  const session = await auth();
  if (!session || session.user?.role !== "COOK") redirect("/auth/login");

  const cookId = session.user.id as string;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: {
      cookId,
    },
    orderBy: [
      { createdAt: "desc" },
    ],
    include: {
      customer: { select: { id: true, name: true, phone: true } },
      items: { include: { dish: { select: { name: true, price: true } } } },
    },
  });

  return (
    <>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>
          Commandes
        </h1>
        <p style={{ color: "#64748B", fontSize: "15px", fontWeight: 400 }}>
          Gérez et suivez toutes vos commandes
        </p>
      </div>

      <CookOrderManager initialOrders={orders} cookId={cookId} />
    </>
  );
}
