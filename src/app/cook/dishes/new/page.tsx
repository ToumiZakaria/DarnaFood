import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import DishForm from "@/components/cook/DishForm";

export const metadata = {
  title: "Ajouter un plat | Espace Cuisinier",
};

export default async function NewDishPage() {
  const session = await auth();
  if (!session || session.user?.role !== "COOK") redirect("/auth/login");

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

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

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>
          Ajouter un nouveau plat
        </h1>
        <p style={{ color: "#64748B", fontSize: "13px", fontWeight: 400 }}>
          Remplissez les informations et ajoutez des photos appétissantes
        </p>
      </div>

      <DishForm categories={categories} />
    </div>
  );
}
