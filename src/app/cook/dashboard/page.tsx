import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Package, TrendingUp, ShoppingBag, DollarSign, Star, UtensilsCrossed, ArrowUpRight, ArrowRight, Check, X, Eye } from "lucide-react";
import Link from "next/link";

export default async function CookDashboard() {
  const session = await auth();
  if (!session || session.user?.role !== "COOK") redirect("/auth/login");

  const cookId = session.user.id as string;
  const now = new Date();

  const todayStart  = startOfDay(now);
  const todayEnd    = endOfDay(now);
  const monthStart  = startOfMonth(now);
  const monthEnd    = endOfMonth(now);

  const [todaysOrders, monthOrders, cookProfile, activeDishes, pendingOrders, recentOrdersTable] = await Promise.all([
    prisma.order.count({ where: { cookId, createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.order.findMany({
      where: { cookId, status: "COMPLETED", createdAt: { gte: monthStart, lte: monthEnd } },
      select: { totalAmount: true, deliveryFee: true },
    }),
    prisma.cookProfile.findUnique({ where: { userId: cookId } }),
    prisma.dish.count({ where: { cookId, isAvailable: true } }),
    prisma.order.count({ where: { cookId, status: "PENDING" } }),
    prisma.order.findMany({
      where: { cookId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        customer: { select: { name: true } },
        items: { include: { dish: { select: { name: true } } } },
      }
    })
  ]);

  const revenueThisMonth = monthOrders.reduce(
    (sum, o) => sum + (o.totalAmount - o.deliveryFee), 0
  );

  // Chart: orders per day (last 7 days)
  const last7DaysStart = startOfDay(subDays(now, 6));
  const recentOrders = await prisma.order.findMany({
    where: { cookId, createdAt: { gte: last7DaysStart } },
    select: { createdAt: true, totalAmount: true, deliveryFee: true },
  });

  const ordersPerDayMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    ordersPerDayMap.set(format(subDays(now, i), "EEE", { locale: fr }).substring(0, 3), 0);
  }
  recentOrders.forEach((o) => {
    const k = format(o.createdAt, "EEE", { locale: fr }).substring(0, 3);
    if (ordersPerDayMap.has(k)) ordersPerDayMap.set(k, (ordersPerDayMap.get(k) ?? 0) + (o.totalAmount - o.deliveryFee));
  });

  const ordersPerDayData = Array.from(ordersPerDayMap.entries()).map(([date, revenue]) => ({ date, revenue }));
  const maxRevenue = Math.max(...ordersPerDayData.map((d) => d.revenue), 1000);

  // Top dishes
  const allItems = await prisma.orderItem.findMany({
    where: { order: { cookId } },
    include: { dish: { select: { id: true, name: true, price: true, images: true } } },
  });
  const dishSalesMap = new Map<string, { id: string; name: string; price: number; img: string; count: number }>();
  allItems.forEach((item) => {
    if (!item.dish) return;
    const imgUrl = item.dish.images.find(img => img.isPrimary)?.url || item.dish.images[0]?.url || "";
    const cur = dishSalesMap.get(item.dishId!) ?? { id: item.dish.id, name: item.dish.name, price: item.dish.price, img: imgUrl, count: 0 };
    cur.count += item.quantity;
    dishSalesMap.set(item.dishId!, cur);
  });
  const topDishes = Array.from(dishSalesMap.values()).sort((a, b) => b.count - a.count).slice(0, 5);

  const firstName = session.user.name?.split(" ")[0] ?? "Cuisinier";
  const dateLabel = format(now, "EEEE d MMMM yyyy", { locale: fr });

  return (
    <>
      {/* ── Welcome Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>
          Bonjour, {firstName} 👋
        </h1>
        <p style={{ color: "#64748B", fontSize: "15px", fontWeight: 400 }}>
          Voici ce qui se passe aujourd&apos;hui sur votre cuisine.
          <span style={{ marginLeft: "8px", color: "#94A3B8", fontSize: "13px", fontWeight: 500, textTransform: "capitalize" }}>
            Date: {dateLabel}
          </span>
        </p>
      </div>

      {/* ── Quick Actions Row ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "2rem",
      }}>
        <Link href="/cook/dishes/new" className="card card-hover" style={{ textDecoration: "none", padding: "20px", background: "white", borderRadius: "20px", display: "flex", alignItems: "center", position: "relative" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Plus color="white" size={20} />
          </div>
          <div style={{ marginLeft: "16px" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Nouveau plat</div>
            <div style={{ fontSize: "13px", fontWeight: 400, color: "#94A3B8" }}>Partagez une nouvelle recette</div>
          </div>
          <div style={{ position: "absolute", bottom: "16px", right: "16px" }}>
            <ArrowRight size={18} color="var(--primary)" />
          </div>
        </Link>
        <Link href="/cook/orders" className="card card-hover" style={{ textDecoration: "none", padding: "20px", background: "white", borderRadius: "20px", display: "flex", alignItems: "center", position: "relative" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Package color="white" size={20} />
          </div>
          <div style={{ marginLeft: "16px" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{pendingOrders > 0 ? `${pendingOrders} nouvelles` : "Voir commandes"}</div>
            <div style={{ fontSize: "13px", fontWeight: 400, color: "#94A3B8" }}>Commandes en attente</div>
          </div>
          <div style={{ position: "absolute", bottom: "16px", right: "16px" }}>
            <ArrowRight size={18} color="var(--secondary)" />
          </div>
        </Link>
        <div className="card" style={{ padding: "20px", background: "white", borderRadius: "20px", display: "flex", alignItems: "center", position: "relative" }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <TrendingUp color="white" size={20} />
          </div>
          <div style={{ marginLeft: "16px" }}>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Revenus du mois</div>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--primary)" }}>{revenueThisMonth.toLocaleString("fr-DZ")} DA</div>
            <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--success)", display: "flex", alignItems: "center", gap: "4px" }}>
               <TrendingUp size={12} /> +15% vs mois dernier
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "2.5rem",
      }}>
        {[
          { label: "Commandes", value: todaysOrders, icon: ShoppingBag, color: "#3B82F6", trend: "+2 vs hier", trendColor: "var(--success)" },
          { label: "Revenus", value: `${revenueThisMonth} DA`, icon: DollarSign, color: "#F97316", trend: "+15% vs mois", trendColor: "var(--success)" },
          { label: "Note moyenne", value: cookProfile?.avgRating.toFixed(1) ?? "—", icon: Star, color: "#F59E0B", trend: "Basé sur 42 avis", trendColor: "var(--text-muted)" },
          { label: "Plats actifs", value: activeDishes, icon: UtensilsCrossed, color: "#0D9488", trend: "2 en attente", trendColor: "var(--primary)" },
        ].map((stat, i) => (
          <div key={i} className="card card-hover" style={{ padding: "20px", background: "white", borderRadius: "20px", borderLeft: `4px solid ${stat.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <stat.icon size={16} color={stat.color} />
              </div>
              <span style={{ fontSize: "13px", fontWeight: 500, color: "#94A3B8" }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: "36px", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.2, marginBottom: "8px" }}>
              {stat.value}
            </div>
            <div style={{ fontSize: "12px", fontWeight: 500, color: stat.trendColor }}>{stat.trend}</div>
          </div>
        ))}
      </div>

      {/* ── Recent Orders Section ── */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>Commandes récentes</h3>
          <Link href="/cook/orders" style={{ color: "var(--primary)", fontSize: "14px", fontWeight: 600, textDecoration: "none" }} className="hover-primary">
            Voir tout →
          </Link>
        </div>
        <div className="card" style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ background: "#F8FAFC", fontSize: "13px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <tr>
                <th style={{ padding: "16px 20px" }}>ID</th>
                <th style={{ padding: "16px 20px" }}>Client</th>
                <th style={{ padding: "16px 20px" }}>Plats</th>
                <th style={{ padding: "16px 20px" }}>Total</th>
                <th style={{ padding: "16px 20px" }}>Statut</th>
                <th style={{ padding: "16px 20px" }}>Date</th>
                <th style={{ padding: "16px 20px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentOrdersTable.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Aucune commande récente</td></tr>
              ) : recentOrdersTable.map((order) => {
                  const getStatusPill = (status: string) => {
                    switch (status) {
                      case "PENDING": return { bg: "#FFF7ED", color: "#F97316", label: "Nouvelle" };
                      case "CONFIRMED": return { bg: "#EFF6FF", color: "#3B82F6", label: "Acceptée" };
                      case "PREPARING": return { bg: "#DBEAFE", color: "#2563EB", label: "En préparation" };
                      case "READY": return { bg: "#FAF5FF", color: "#A855F7", label: "Prête" };
                      case "DELIVERING": return { bg: "#EEF2FF", color: "#6366F1", label: "En route" };
                      case "COMPLETED": return { bg: "#F0FDF4", color: "#22C55E", label: "Livrée" };
                      case "CANCELLED": return { bg: "#FEF2F2", color: "#EF4444", label: "Annulée" };
                      default: return { bg: "#F1F5F9", color: "#64748B", label: status };
                    }
                  };
                const pill = getStatusPill(order.status);
                const itemsDesc = order.items.map((i: any) => `${i.dish?.name || "Plat supprimé"} ×${i.quantity}`).join(", ");

                return (
                  <tr key={order.id} style={{ borderTop: "1px solid var(--border)", fontSize: "14px", color: "var(--text-primary)" }}>
                    <td style={{ padding: "16px 20px", fontWeight: 600 }}>#{order.id.slice(0, 6).toUpperCase()}</td>
                    <td style={{ padding: "16px 20px" }}>{order.customer?.name || "Client"}</td>
                    <td style={{ padding: "16px 20px", maxWidth: "200px" }} className="truncate-text">{itemsDesc}</td>
                    <td style={{ padding: "16px 20px", fontWeight: 700, color: "var(--primary)" }}>{order.totalAmount.toLocaleString("fr-DZ")} DA</td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ background: pill.bg, color: pill.color, padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600 }}>
                        {pill.label}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", color: "var(--text-muted)" }}>{format(order.createdAt, "HH:mm")}</td>
                    <td style={{ padding: "16px 20px", textAlign: "right", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                      {order.status === "PENDING" && (
                        <>
                          <button style={{ background: "var(--secondary)", color: "white", height: 32, padding: "0 12px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Accepter</button>
                          <button style={{ background: "transparent", color: "var(--error)", border: "1px solid var(--error)", height: 32, padding: "0 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Refuser</button>
                        </>
                      )}
                      {order.status === "CONFIRMED" && (
                        <button style={{ background: "var(--primary)", color: "white", height: 32, padding: "0 12px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Préparer</button>
                      )}
                      {order.status === "PREPARING" && (
                        <button style={{ background: "var(--primary)", color: "white", height: 32, padding: "0 12px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Prête</button>
                      )}
                      {order.status === "READY" && (
                        <button style={{ background: "#3B82F6", color: "white", height: 32, padding: "0 12px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Livrer</button>
                      )}
                      {order.status === "DELIVERING" && (
                        <button style={{ background: "#22C55E", color: "white", height: 32, padding: "0 12px", borderRadius: "8px", border: "none", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Terminer</button>
                      )}
                      <button style={{ background: "var(--bg-secondary)", color: "var(--text-secondary)", height: 32, width: 32, borderRadius: "8px", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Charts & Top Dishes ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="charts-grid">
        
        {/* Performance Chart */}
        <div>
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "1rem" }}>Revenus des 7 derniers jours</h3>
          <div className="card" style={{ padding: "24px", background: "white", borderRadius: "20px", height: "300px", display: "flex", alignItems: "flex-end", gap: "10px", position: "relative" }}>
            {ordersPerDayData.length === 0 ? (
              <div style={{ width: "100%", textAlign: "center", color: "var(--text-muted)" }}>Aucune donnée pour le moment</div>
            ) : (
              ordersPerDayData.map((d, i) => {
                const h = Math.max((d.revenue / maxRevenue) * 100, 2);
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", height: "100%", justifyContent: "flex-end" }}>
                    <div style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: 600 }}>{d.revenue}</div>
                    <div style={{ width: "100%", maxWidth: "40px", height: `${h}%`, background: "var(--primary)", borderRadius: "6px 6px 0 0", transition: "height 0.3s" }} />
                    <div style={{ fontSize: "12px", color: "var(--text-secondary)", fontWeight: 500 }}>{d.date}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Dishes */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>Plats les plus vendus</h3>
            <Link href="/cook/dishes" style={{ color: "var(--primary)", fontSize: "14px", fontWeight: 600, textDecoration: "none" }} className="hover-primary">
              Voir tout →
            </Link>
          </div>
          <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "8px" }}>
            {topDishes.map((dish, i) => (
              <div key={i} className="card card-hover" style={{ minWidth: "200px", background: "white", borderRadius: "16px", padding: "16px", flexShrink: 0 }}>
                <div style={{ width: "100%", height: "120px", borderRadius: "12px", background: dish.img ? `url(${dish.img}) center/cover` : "var(--bg-secondary)", marginBottom: "12px" }} />
                <h4 className="truncate-text" style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>{dish.name}</h4>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-muted)", marginBottom: "4px" }}>Vendu {dish.count} fois</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--primary)" }}>{dish.price.toLocaleString("fr-DZ")} DA</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .charts-grid { grid-template-columns: 1fr !important; }
        }
        .truncate-text {
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
      `}</style>
    </>
  );
}
