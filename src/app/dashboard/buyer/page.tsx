import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import {
  LayoutDashboard, ShoppingBag, Heart, User, Settings,
  Star, Clock, MapPin, CheckCircle, Package, TrendingUp, ChefHat
} from "lucide-react";

export const metadata: Metadata = { title: "Mon compte | DarnaFood" };

const sideLinks = [
  { href: "/dashboard/buyer", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/dashboard/buyer/orders", label: "Mes commandes", icon: ShoppingBag },
  { href: "/dashboard/buyer/favorites", label: "Favoris", icon: Heart },
  { href: "/dashboard/buyer/profile", label: "Mon profil", icon: User },
  { href: "/dashboard/buyer/settings", label: "Paramètres", icon: Settings },
];

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

    // 2. Fetch up to 5 recent orders
    const dbOrders = await prisma.order.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        cook: { select: { name: true } },
        items: {
          include: {
            dish: { select: { name: true } }
          }
        }
      }
    });

    recentOrders = dbOrders.map(order => {
      const dishNames = order.items.map((i: any) => i.dish?.name || "Plat").join(", ");
      
      const STATUS_MAP: Record<string, { label: string; color: string }> = {
        PENDING:    { label: "En attente",    color: "#F59E0B" },
        CONFIRMED:  { label: "Confirmée",     color: "#3B82F6" },
        PREPARING:  { label: "En préparation",color: "#8B5CF6" },
        DELIVERING: { label: "En route",      color: "#0D9488" },
        COMPLETED:  { label: "Livrée",        color: "#22C55E" },
        CANCELLED:  { label: "Annulée",       color: "#EF4444" },
      };
      
      const config = STATUS_MAP[order.status] || { label: order.status, color: "#64748B" };
      
      const dateStr = new Date(order.createdAt).toLocaleDateString("fr-DZ", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });

      return {
        id: order.id,
        dish: dishNames || "Sans titre",
        cook: order.cook?.name || "Cuisinier",
        date: dateStr,
        total: order.totalAmount,
        status: config.label,
        statusColor: config.color
      };
    });

    // 3. Fetch up to 4 real recommended dishes
    const dbDishes = await prisma.dish.findMany({
      take: 4,
      where: { isAvailable: true },
      include: {
        cook: { select: { name: true } },
        images: { select: { url: true } }
      }
    });

    recommendedDishes = dbDishes.map(dish => ({
      id: dish.id,
      name: dish.name,
      cook: dish.cook?.name || "Cuisinier",
      price: dish.price,
      rating: 4.8, // Fallback default
      image: dish.images[0]?.url || "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&q=80"
    }));

  } catch (error) {
    console.error("Error loading dashboard data from database:", error);
  }

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "240px 1fr", gap: "2rem", alignItems: "flex-start" }} className="buyer-grid">

        {/* ── Sidebar ── */}
        <aside style={{ background: "white", borderRadius: 20, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", position: "sticky", top: "calc(72px + 1.5rem)" }}>
          {/* Avatar */}
          <div style={{ textAlign: "center", paddingBottom: "1.25rem", marginBottom: "1rem", borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #EA580C)", color: "white", fontSize: "22px", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.625rem" }}>
              {userInitial}
            </div>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>{session.user?.name}</div>
            <div style={{ fontSize: "12px", color: "#94A3B8", marginTop: 2 }}>Mon compte</div>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            {sideLinks.map(link => (
              <Link key={link.href} href={link.href}
                style={{ display: "flex", alignItems: "center", gap: "0.625rem", padding: "0.625rem 0.875rem", borderRadius: 12, fontSize: "14px", fontWeight: 500, color: link.href === "/dashboard/buyer" ? "#F97316" : "#475569", background: link.href === "/dashboard/buyer" ? "#FFF7ED" : "transparent", textDecoration: "none", transition: "all 150ms" }}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* Welcome */}
          <div style={{ background: "linear-gradient(135deg, #FAEEDA, #FFF7ED)", borderRadius: 20, padding: "1.75rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 1.875rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.375rem" }}>
                Bonjour, {firstName} 👋
              </h1>
              <p style={{ fontSize: "15px", color: "#64748B" }}>Que souhaitez-vous manger aujourd&apos;hui ?</p>
            </div>
            <Link href="/dishes" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", height: 44, padding: "0 1.25rem", borderRadius: 12, background: "#F97316", color: "white", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
              <ChefHat size={16} /> Explorer les plats
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            {[
              { icon: Package, color: "#F97316", bg: "#FFF7ED", label: "Commandes", value: orderCount },
              { icon: Heart, color: "#EF4444", bg: "#FEF2F2", label: "Plats favoris", value: 0 },
              { icon: ChefHat, color: "#0D9488", bg: "#F0FDFA", label: "Cuisiniers suivis", value: 0 },
            ].map(stat => (
              <div key={stat.label} style={{ background: "white", borderRadius: 16, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <stat.icon size={20} color={stat.color} />
                </div>
                <div>
                  <div style={{ fontSize: "24px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: 3 }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A" }}>Commandes récentes</h2>
              <Link href="/dashboard/buyer/orders" style={{ fontSize: "13px", fontWeight: 600, color: "#F97316", textDecoration: "none" }}>Voir tout →</Link>
            </div>

            {recentOrders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem 0" }}>
                <Package size={32} color="#CBD5E1" style={{ margin: "0 auto 0.75rem" }} />
                <p style={{ fontSize: "14px", color: "#94A3B8" }}>Aucune commande pour le moment.</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      {["Commande", "Plat", "Cuisinier", "Date", "Total", "Statut"].map(h => (
                        <th key={h} style={{ padding: "0.625rem 0.875rem", textAlign: "left", fontSize: "12px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map(order => (
                      <tr key={order.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                        <td style={{ padding: "0.875rem", fontWeight: 700, color: "#0F172A" }}>#{order.id.slice(-6).toUpperCase()}</td>
                        <td style={{ padding: "0.875rem", color: "#475569" }}>{order.dish}</td>
                        <td style={{ padding: "0.875rem", color: "#64748B" }}>{order.cook}</td>
                        <td style={{ padding: "0.875rem", color: "#94A3B8" }}>{order.date}</td>
                        <td style={{ padding: "0.875rem", fontWeight: 700, color: "#F97316" }}>{order.total.toLocaleString("fr-DZ")} DA</td>
                        <td style={{ padding: "0.875rem" }}>
                          <span style={{ background: `${order.statusColor}18`, color: order.statusColor, fontSize: "12px", fontWeight: 700, padding: "0.25rem 0.625rem", borderRadius: 9999 }}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Recommended dishes */}
          <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A" }}>
                <TrendingUp size={18} style={{ display: "inline", marginRight: "0.5rem", color: "#F97316" }} />
                Recommandés pour vous
              </h2>
              <Link href="/dishes" style={{ fontSize: "13px", fontWeight: 600, color: "#F97316", textDecoration: "none" }}>Voir tout →</Link>
            </div>

            {recommendedDishes.length === 0 ? (
              <p style={{ fontSize: "14px", color: "#94A3B8", textAlign: "center", padding: "1rem" }}>Aucun plat recommandé pour le moment.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }} className="recs-grid">
                {recommendedDishes.map(dish => (
                  <Link key={dish.id} href={`/dishes/${dish.id}`} className="dashboard-rec-card" style={{ textDecoration: "none", background: "#F8FAFC", borderRadius: 14, overflow: "hidden", display: "block", transition: "all 200ms" }}>
                    <div style={{ height: 100, overflow: "hidden" }}>
                      <img src={dish.image} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ padding: "0.75rem" }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dish.name}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.375rem" }}>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: "#F97316" }}>{dish.price} DA</span>
                        <span style={{ fontSize: "11px", color: "#94A3B8", display: "flex", alignItems: "center", gap: 2 }}>
                          <Star size={10} fill="#FBBF24" color="#FBBF24" /> {dish.rating}
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
          .recs-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .dashboard-rec-card { transition: all 200ms; }
        .dashboard-rec-card:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  );
}
