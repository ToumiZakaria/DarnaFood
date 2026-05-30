import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import CookPublicClient from "./CookPublicClient";

export const metadata = {
  title: "Ma Page Publique | Espace Cuisinier | DarnaFood",
};

export default async function CookPublicPage() {
  const session = await auth();
  if (!session || session.user?.role !== "COOK") redirect("/auth/login");

  const cookId = session.user.id as string;

  // Fetch cook profile
  const cookProfile = await prisma.user.findUnique({
    where: { id: cookId },
    include: {
      cookProfile: true,
      dishes: {
        include: {
          category: true,
          images: true,
        },
        orderBy: { createdAt: "desc" },
      },
      reviewsReceived: {
        include: {
          customer: {
            select: { name: true, image: true },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!cookProfile || !cookProfile.cookProfile) {
    redirect("/cook/profile");
  }

  // Calculate stats
  const totalOrders = cookProfile.cookProfile.totalOrders;
  const avgRating = cookProfile.cookProfile.avgRating;
  const totalDishes = cookProfile.dishes.length;
  const totalReviews = cookProfile.reviewsReceived.length;

  return (
    <div style={{ maxWidth: "72rem", margin: "0 auto", padding: "2rem" }}>
      <CookPublicClient
        user={{
          id: cookProfile.id,
          name: cookProfile.name,
          image: cookProfile.image,
        }}
        profile={cookProfile.cookProfile}
        dishes={cookProfile.dishes}
        reviews={cookProfile.reviewsReceived}
        stats={{
          totalOrders,
          avgRating,
          totalDishes,
          totalReviews,
        }}
      />
    </div>
  );
}
