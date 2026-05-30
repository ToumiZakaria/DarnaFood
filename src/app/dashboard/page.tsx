import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CustomerTabs from "@/components/dashboard/CustomerTabs";

export default async function CustomerDashboard() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true }
  });

  if (!user) {
    redirect("/auth/login");
  }

  const orders = await prisma.order.findMany({
    where: { customerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      cook: { select: { name: true } },
      items: {
        include: { dish: { select: { name: true } } }
      }
    }
  });

  return (
    <div className="container section max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord client</h1>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CustomerTabs orders={orders as any} user={user} />
    </div>
  );
}
