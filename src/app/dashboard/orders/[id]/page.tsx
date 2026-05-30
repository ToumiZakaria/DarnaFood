import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import OrderTimeline from "@/components/orders/OrderTimeline";
import OrderItemCard from "@/components/orders/OrderItemCard";
import OrderSummary from "@/components/orders/OrderSummary";
import CookInfoCard from "@/components/orders/CookInfoCard";
import OrderReview from "@/components/orders/OrderReview";

export default async function OrderDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    redirect("/auth/login");
  }

  const params = await paramsPromise;

  const order = await prisma.order.findUnique({
    where: {
      id: params.id,
      customerId: session.user.id,
    },
    include: {
      cook: {
        select: {
          id: true,
          name: true,
          image: true,
          cookProfile: {
            select: { address: true, commune: true, wilaya: true },
          },
          reviewsReceived: {
            select: { rating: true },
          },
        },
      },
      items: {
        include: {
          dish: {
            select: {
              name: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      },
      review: true,
    },
  });

  if (!order) {
    return (
      <div className="container section text-center">
        <h1 className="text-2xl font-bold mb-4">Commande introuvable</h1>
        <Link href="/dashboard" className="btn btn-primary">Retour au tableau de bord</Link>
      </div>
    );
  }

  const allRatings = order.cook.reviewsReceived.map((r) => r.rating);
  const avgRating = allRatings.length > 0
    ? allRatings.reduce((a, b) => a + b, 0) / allRatings.length
    : 0;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1.5rem" }}>
      <Link
        href="/dashboard/buyer/orders"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          color: "#64748B", fontSize: 14, fontWeight: 500,
          textDecoration: "none", marginBottom: 24,
        }}
        className="hover:text-[#F97316]"
      >
        <ArrowLeft size={16} />
        Retour aux commandes
      </Link>

      <OrderTimeline
        orderId={order.id}
        currentStatus={order.status}
        createdAt={order.createdAt}
        updatedAt={order.updatedAt}
        customerId={session.user.id}
        orderType={order.type}
      />

      <div style={{ marginTop: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>🛒</span>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#1E293B", margin: 0 }}>
            Articles ({order.items.length})
          </h3>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E2E8F0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            padding: "4px 20px",
          }}
        >
          {order.items.map((item) => (
            <OrderItemCard
              key={item.id}
              name={item.dish?.name || "Plat"}
              quantity={item.quantity}
              price={item.priceAtOrder}
              imageUrl={item.dish?.images[0]?.url}
            />
          ))}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <OrderSummary
          createdAt={order.createdAt}
          type={order.type}
          totalAmount={order.totalAmount}
          deliveryFee={order.deliveryFee}
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <CookInfoCard
          cookId={order.cook.id}
          name={order.cook.name ?? "Cuisinier"}
          image={order.cook.image}
          address={order.cook.cookProfile?.address}
          commune={order.cook.cookProfile?.commune}
          wilaya={order.cook.cookProfile?.wilaya}
          avgRating={avgRating}
          reviewCount={allRatings.length}
        />
      </div>

      <div style={{ marginTop: 24 }}>
        <OrderReview
          orderId={order.id}
          cookId={order.cook.id}
          existingReview={order.review}
        />
      </div>
    </div>
  );
}
