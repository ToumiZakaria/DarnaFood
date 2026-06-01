import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import BuyerSidebar from "@/components/dashboard/BuyerSidebar";
import {
  Star, Package, TrendingUp, ChefHat, Heart
} from "lucide-react";

export const metadata: Metadata = { title: "Mon compte | DarnaFood" };

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING:    { label: "En attente",    color: "#F59E0B" },
  CONFIRMED:  { label: "Confirmée",     color: "#3B82F6" },
  PREPARING:  { label: "En préparation",color: "#8B5CF6" },
  DELIVERING: { label: "En route",      color: "#0D9488" },
  COMPLETED:  { label: "Livrée",        color: "#22C55E" },
  CANCELLED:  { label: "Annulée",       color: "#EF4444" },
};

export default async function BuyerDashboard() {
  const session = await auth();
  if (!session || !session.user || !session.user.id) redirect("/auth/login");
  if (session.user?.role === "COOK") redirect("/cook/dashboard");

  const userId = session.user.id;
  const firstName = session.user?.name?.split(" ")[0] ?? "Utilisateur";
  const userInitial = session.user?.name?.[0]?.toUpperCase() ?? "U";

  let orderCount = 0;
  let recentOrders: any[] = [];
  let recommendedDishes: any[] = [];

  try {
    orderCount = await prisma.order.count({ where: { customerId: userId } });

    const dbOrders = await prisma.order.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        cook: { select: { name: true } },
        items: { include: { dish: { select: { name: true } } } },
      },
    });

    recentOrders = dbOrders.map(order => {
      const dishNames = order.items.map((i: any) => i.dish?.name || "Plat").join(", ");
      const config = STATUS_MAP[order.status] || { label: order.status, color: "#64748B" };
      const dateStr = new Date(order.createdAt).toLocaleDateString("fr-DZ", {
        day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit",
      });
      return {
        id: order.id,
        dish: dishNames || "Sans titre",
        cook: order.cook?.name || "Cuisinier",
        date: dateStr,
        total: order.totalAmount,
        status: config.label,
        statusColor: config.color,
      };
    });

    const dbDishes = await prisma.dish.findMany({
      take: 4,
      where: { isAvailable: true },
      include: { cook: { select: { name: true } }, images: { select: { url: true } } },
    });

    recommendedDishes = dbDishes.map(dish => ({
      id: dish.id,
      name: dish.name,
      cook: dish.cook?.name || "Cuisinier",
      price: dish.price,
      rating: 4.8,
      image: dish.images[0]?.url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80",
    }));
  } catch (error) {
    console.error("Error loading dashboard data:", error);
  }

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "1.5rem 1rem", display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem", alignItems: "flex-start" }} className="buyer-grid">

        <BuyerSidebar userName={session.user?.name ?? undefined} userInitial={userInitial} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

          {/* Welcome */}
          <div style={{ background: "linear-gradient(135deg, #FAEEDA, #FFF7ED)", borderRadius: 18, padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }} className="buyer-welcome">
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.25rem" }}>
                Bonjour, {firstName} 👋
              </h1>
              <p style={{ fontSize: "14px", color: "#64748B" }}>Que souhaitez-vous manger aujourd&apos;hui ?</p>
            </div>
            <Link href="/dishes" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", height: 40, padding: "0 1rem", borderRadius: 10, background: "#F97316", color: "white", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
              <ChefHat size={15} /> Explorer
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.75rem" }} className="buyer-stats">
            {[
              { icon: Package, color: "#F97316", bg: "#FFF7ED", label: "Commandes", value: orderCount },
              { icon: Heart, color: "#EF4444", bg: "#FEF2F2", label: "Favoris", value: 0 },
              { icon: ChefHat, color: "#0D9488", bg: "#F0FDFA", label: "Suivis", value: 0 },
            ].map(stat => (
              <div key={stat.label} style={{ background: "white", borderRadius: 14, padding: "1rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "0.75rem" }} className="buyer-stat-card">
                <div style={{ width: 38, height: 38, borderRadius: 10, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <stat.icon size={18} color={stat.color} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={{ background: "white", borderRadius: 18, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>Commandes récentes</h2>
              <Link href="/dashboard/buyer/orders" style={{ fontSize: "12px", fontWeight: 600, color: "#F97316", textDecoration: "none" }}>Voir tout →</Link>
            </div>

            {recentOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
                <Package size={28} color="#CBD5E1" style={{ margin: "0 auto 0.5rem" }} />
                <p style={{ fontSize: "13px", color: "#94A3B8" }}>Aucune commande pour le moment.</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="buyer-orders-table" style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                        {["Commande", "Plat", "Cuisinier", "Date", "Total", "Statut"].map(h => (
                          <th key={h} style={{ padding: "0.5rem 0.75rem", textAlign: "left", fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                          <td style={{ padding: "0.625rem 0.75rem", fontWeight: 700, color: "#0F172A", fontSize: "12px" }}>#{order.id.slice(-6).toUpperCase()}</td>
                          <td style={{ padding: "0.625rem 0.75rem", color: "#475569", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.dish}</td>
                          <td style={{ padding: "0.625rem 0.75rem", color: "#64748B" }}>{order.cook}</td>
                          <td style={{ padding: "0.625rem 0.75rem", color: "#94A3B8", whiteSpace: "nowrap" }}>{order.date}</td>
                          <td style={{ padding: "0.625rem 0.75rem", fontWeight: 700, color: "#F97316", whiteSpace: "nowrap" }}>{order.total.toLocaleString("fr-DZ")} DA</td>
                          <td style={{ padding: "0.625rem 0.75rem" }}>
                            <span style={{ background: `${order.statusColor}18`, color: order.statusColor, fontSize: "11px", fontWeight: 700, padding: "0.2rem 0.5rem", borderRadius: 9999, whiteSpace: "nowrap" }}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="buyer-orders-cards" style={{ display: "none", flexDirection: "column", gap: "0.5rem" }}>
                  {recentOrders.map(order => (
                    <div key={order.id} style={{ background: "#F8FAFC", borderRadius: 12, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A" }}>#{order.id.slice(-6).toUpperCase()}</span>
                        <span style={{ background: `${order.statusColor}18`, color: order.statusColor, fontSize: "10px", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: 9999 }}>{order.status}</span>
                      </div>
                      <div style={{ fontSize: "13px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.dish}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#94A3B8" }}>
                        <span>{order.cook} · {order.date}</span>
                        <span style={{ fontSize: "14px", fontWeight: 800, color: "#F97316" }}>{order.total.toLocaleString("fr-DZ")} DA</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Recommended */}
          <div style={{ background: "white", borderRadius: 18, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>
                <TrendingUp size={16} style={{ display: "inline", marginRight: "0.4rem", color: "#F97316", verticalAlign: "middle" }} />
                Recommandés
              </h2>
              <Link href="/dishes" style={{ fontSize: "12px", fontWeight: 600, color: "#F97316", textDecoration: "none" }}>Voir tout →</Link>
            </div>

            {recommendedDishes.length === 0 ? (
              <p style={{ fontSize: "13px", color: "#94A3B8", textAlign: "center", padding: "1rem" }}>Aucun plat recommandé pour le moment.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }} className="recs-grid">
                {recommendedDishes.map(dish => (
                  <Link key={dish.id} href={`/dishes/${dish.id}`} className="dashboard-rec-card" style={{ textDecoration: "none", background: "#F8FAFC", borderRadius: 12, overflow: "hidden", display: "block", transition: "all 200ms" }}>
                    <div style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                      <img src={dish.image} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "0.625rem" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dish.name}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700, color: "#F97316" }}>{dish.price} DA</span>
                        <span style={{ fontSize: "10px", color: "#94A3B8", display: "flex", alignItems: "center", gap: 2 }}>
                          <Star size={9} fill="#FBBF24" color="#FBBF24" /> {dish.rating}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .buyer-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .buyer-orders-table { display: none !important; }
          .buyer-orders-cards { display: flex !important; }
          .recs-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .buyer-welcome { padding: 1rem !important; }
          .buyer-stat-card { padding: 0.75rem !important; }
        }
        @media (max-width: 380px) {
          .buyer-stats { grid-template-columns: 1fr !important; }
        }
        .dashboard-rec-card { transition: all 200ms; }
        .dashboard-rec-card:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
