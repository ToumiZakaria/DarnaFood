import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import DishListClient from "@/components/cook/DishListClient";

export const metadata = {
  title: "Mes Plats | Espace Cuisinier",
};

export default async function CookDishesPage() {
  const session = await auth();
  if (!session || session.user?.role !== "COOK") redirect("/auth/login");

  const dishes = await prisma.dish.findMany({
    where: { cookId: session.user.id },
    include: {
      category: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <DishListClient initialDishes={dishes} />
    </>
  );
}
