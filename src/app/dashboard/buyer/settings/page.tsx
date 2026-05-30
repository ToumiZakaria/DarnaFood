import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import SettingsContent from "./SettingsContent";

export const metadata = {
  title: "Paramètres | DarnaFood",
};

export default async function BuyerSettingsPage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorEnabled: true },
  });

  return <SettingsContent twoFactorEnabled={user?.twoFactorEnabled ?? false} />;
}
