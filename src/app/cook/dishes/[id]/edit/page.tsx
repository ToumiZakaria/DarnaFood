import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DishForm from "@/components/cook/DishForm";

export const metadata = {
  title: "Modifier le plat | Espace Cuisinier",
};

export default async function EditDishPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user?.role !== "COOK") redirect("/auth/login");

  const resolvedParams = await params;

  const [dish, categories] = await Promise.all([
    prisma.dish.findUnique({
      where: { id: resolvedParams.id, cookId: session.user.id },
      include: { images: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!dish) redirect("/cook/dishes");

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <Link
        href="/cook/dishes"
        style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          color: "#64748B", fontSize: "14px", fontWeight: 600, textDecoration: "none",
          marginBottom: "1.5rem"
        }}
      >
        <ArrowLeft size={16} /> Retour aux plats
      </Link>

      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>
          Modifier le plat
        </h1>
        <p style={{ color: "#64748B", fontSize: "15px", fontWeight: 400 }}>
          {dish.name}
        </p>
      </div>

      <DishForm initialData={dish} categories={categories} />
    </div>
  );
}
