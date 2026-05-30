import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CookProfileForm from "@/components/cook/CookProfileForm";

export const metadata = {
  title: "Mon Profil | Espace Cuisinier",
};

export default async function CookProfilePage() {
  const session = await auth();
  if (!session || session.user?.role !== "COOK") redirect("/auth/login");

  const userId = session.user.id as string;

  const [user, profile] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true, name: true, image: true, phone: true } }),
    prisma.cookProfile.findUnique({ where: { userId } }),
  ]);

  if (!user) redirect("/auth/login");

  return (
    <>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>
          Mon Profil
        </h1>
        <p style={{ color: "#64748B", fontSize: "15px", fontWeight: 400 }}>
          Gérez vos informations et votre apparence publique
        </p>
      </div>
      
      <CookProfileForm user={user} profile={profile} />
    </>
  );
}
