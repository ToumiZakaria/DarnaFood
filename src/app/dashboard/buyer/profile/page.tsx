import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import BuyerProfileForm from "./BuyerProfileForm";

export const metadata = {
  title: "Mon profil | DarnaFood",
};

export default async function BuyerProfilePage() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/auth/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
    },
  });

  if (!user) {
    redirect("/auth/login");
  }

  return <BuyerProfileForm initialUser={user} />;
}
