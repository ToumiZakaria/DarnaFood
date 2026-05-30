import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CookSettingsClient from "./CookSettingsClient";

export const metadata = {
  title: "Paramètres | Espace Cuisinier",
};

export default async function CookSettingsPage() {
  const session = await auth();
  if (!session || session.user?.role !== "COOK") redirect("/auth/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true },
  });

  return <CookSettingsClient twoFactorEnabled={user?.twoFactorEnabled ?? false} />;
}
