import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format, subDays, startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { Plus, Package, TrendingUp, ShoppingBag, DollarSign, Star, UtensilsCrossed, ArrowRight, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";

export default async function CookDashboard() {
  const session = await auth();
  if (!session || session.user?.role !== "COOK") redirect("/auth/login");

  const cookId = session.user.id as string;
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [todaysOrders, monthOrders, cookProfile, activeDishes, pendingOrders, recentOrdersTable] = await Promise.all([
    prisma.order.count({ where: { cookId, createdAt: { gte: todayStart, lte: todayEnd } } }),
    prisma.order.findMany({ where: { cookId, status: "COMPLETED", createdAt: { gte: monthStart, lte: monthEnd } }, select: { totalAmount: true, deliveryFee: true } }),
    prisma.cookProfile.findUnique({ where: { userId: cookId } }),
    prisma.dish.count({ where: { cookId, isAvailable: true } }),
    prisma.order.count({ where: { cookId, status: "PENDING" } }),
    prisma.order.findMany({
      where: { cookId }, orderBy: { createdAt: "desc" }, take: 5,
      include: { customer: { select: { name: true } }, items: { include: { dish: { select: { name: true } } } } }
    })
  ]);

  const revenueThisMonth = monthOrders.reduce((sum, o) => sum + (o.totalAmount - o.deliveryFee), 0);
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
  const dateLabel = format(now, "EEE d MMM", { locale: fr });

  return (
    <>
      {/* Welcome Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>
          Bonjour, {firstName} 👋
        </h1>
        <p style={{ color: "#64748B", fontSize: "13px", fontWeight: 400 }}>
          Voici ce qui se passe aujourd&apos;hui sur votre cuisine.
          <span style={{ marginLeft: "8px", color: "#94A3B8", fontSize: "12px", fontWeight: 500, textTransform: "capitalize" }}>
            {dateLabel}
          </span>
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}>
        <Link href="/cook/dishes/new" style={{ textDecoration: "none", padding: "16px", background: "white", borderRadius: 18, display: "flex", alignItems: "center", position: "relative" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Plus color="white" size={18} />
          </div>
          <div style={{ marginLeft: "12px", minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>Nouveau plat</div>
            <div style={{ fontSize: "12px", color: "#94A3B8" }}>Partagez une recette</div>
          </div>
          <div style={{ position: "absolute", bottom: "12px", right: "12px" }}>
            <ArrowRight size={16} color="var(--primary)" />
          </div>
        </Link>
        <Link href="/cook/orders" style={{ textDecoration: "none", padding: "16px", background: "white", borderRadius: 18, display: "flex", alignItems: "center", position: "relative" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Package color="white" size={18} />
          </div>
          <div style={{ marginLeft: "12px", minWidth: 0 }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{pendingOrders > 0 ? `${pendingOrders} nouvelles` : "Voir commandes"}</div>
            <div style={{ fontSize: "12px", color: "#94A3B8" }}>En attente</div>
          </div>
          <div style={{ position: "absolute", bottom: "12px", right: "12px" }}>
            <ArrowRight size={16} color="var(--secondary)" />
          </div>
        </Link>
        <div style={{ padding: "16px", background: "white", borderRadius: 18, display: "flex", alignItems: "center", position: "relative" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#3B82F6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <TrendingUp color="white" size={18} />
          </div>
          <div style={{ marginLeft: "12px", minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: "12px", color: "#94A3B8" }}>Revenus du mois</div>
            <div style={{ fontSize: "17px", fontWeight: 800, color: "var(--primary)" }}>{revenueThisMonth.toLocaleString("fr-DZ")} DA</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "1.5rem" }}>
        {[
          { label: "Commandes", value: todaysOrders, icon: ShoppingBag, color: "#3B82F6" },
          { label: "Revenus", value: `${revenueThisMonth} DA`, icon: DollarSign, color: "#F97316" },
          { label: "Note", value: cookProfile?.avgRating.toFixed(1) ?? "—", icon: Star, color: "#F59E0B" },
          { label: "Plats", value: activeDishes, icon: UtensilsCrossed, color: "#0D9488" },
        ].map((stat, i) => (
          <div key={i} style={{ padding: "14px", background: "white", borderRadius: 16, borderLeft: `3px solid ${stat.color}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <stat.icon size={14} color={stat.color} />
              </div>
              <span style={{ fontSize: "11px", fontWeight: 500, color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{stat.label}</span>
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1.1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div style={{ marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.875rem" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Commandes récentes</h3>
          <Link href="/cook/orders" style={{ color: "var(--primary)", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
            Voir tout →
          </Link>
        </div>
        <div style={{ background: "white", borderRadius: 18, overflow: "hidden" }}>
          {recentOrdersTable.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)" }}>Aucune commande récente</div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="cook-orders-table" style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
                  <thead style={{ background: "#F8FAFC", fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    <tr>
                      <th style={{ padding: "12px 16px" }}>ID</th>
                      <th style={{ padding: "12px 16px" }}>Client</th>
                      <th style={{ padding: "12px 16px" }}>Plats</th>
                      <th style={{ padding: "12px 16px" }}>Total</th>
                      <th style={{ padding: "12px 16px" }}>Statut</th>
                      <th style={{ padding: "12px 16px" }}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrdersTable.map((order) => {
                      const getStatusPill = (status: string) => {
                        switch (status) {
                          case "PENDING": return { bg: "#FFF7ED", color: "#F97316", label: "Nouvelle" };
                          case "CONFIRMED": return { bg: "#EFF6FF", color: "#3B82F6", label: "Acceptée" };
                          case "PREPARING": return { bg: "#DBEAFE", color: "#2563EB", label: "Préparation" };
                          case "READY": return { bg: "#FAF5FF", color: "#A855F7", label: "Prête" };
                          case "DELIVERING": return { bg: "#EEF2FF", color: "#6366F1", label: "En route" };
                          case "COMPLETED": return { bg: "#F0FDF4", color: "#22C55E", label: "Livrée" };
                          case "CANCELLED": return { bg: "#FEF2F2", color: "#EF4444", label: "Annulée" };
                          default: return { bg: "#F1F5F9", color: "#64748B", label: status };
                        }
                      };
                      const pill = getStatusPill(order.status);
                      const itemsDesc = order.items.map((i: any) => `${i.dish?.name || "Plat"} ×${i.quantity}`).join(", ");
                      return (
                        <tr key={order.id} style={{ borderTop: "1px solid var(--border)" }}>
                          <td style={{ padding: "12px 16px", fontWeight: 600 }}>#{order.id.slice(0, 6).toUpperCase()}</td>
                          <td style={{ padding: "12px 16px" }}>{order.customer?.name || "Client"}</td>
                          <td style={{ padding: "12px 16px", maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{itemsDesc}</td>
                          <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--primary)" }}>{order.totalAmount.toLocaleString("fr-DZ")} DA</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ background: pill.bg, color: pill.color, padding: "3px 8px", borderRadius: "9999px", fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap" }}>
                              {pill.label}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", color: "var(--text-muted)" }}>{format(order.createdAt, "HH:mm")}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="cook-orders-cards" style={{ display: "none", flexDirection: "column", gap: "0.625rem", padding: "0.75rem" }}>
                {recentOrdersTable.map((order) => {
                  const getStatusPill = (status: string) => {
                    switch (status) {
                      case "PENDING": return { bg: "#FFF7ED", color: "#F97316", label: "Nouvelle" };
                      case "CONFIRMED": return { bg: "#EFF6FF", color: "#3B82F6", label: "Acceptée" };
                      case "PREPARING": return { bg: "#DBEAFE", color: "#2563EB", label: "Préparation" };
                      case "READY": return { bg: "#FAF5FF", color: "#A855F7", label: "Prête" };
                      case "DELIVERING": return { bg: "#EEF2FF", color: "#6366F1", label: "En route" };
                      case "COMPLETED": return { bg: "#F0FDF4", color: "#22C55E", label: "Livrée" };
                      case "CANCELLED": return { bg: "#FEF2F2", color: "#EF4444", label: "Annulée" };
                      default: return { bg: "#F1F5F9", color: "#64748B", label: status };
                    }
                  };
                  const pill = getStatusPill(order.status);
                  const itemsDesc = order.items.map((i: any) => `${i.dish?.name || "Plat"} ×${i.quantity}`).join(", ");
                  return (
                    <div key={order.id} style={{ background: "#F8FAFC", borderRadius: 12, padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: 700 }}>#{order.id.slice(0, 6).toUpperCase()}</span>
                        <span style={{ background: pill.bg, color: pill.color, padding: "2px 8px", borderRadius: 9999, fontSize: "11px", fontWeight: 600 }}>{pill.label}</span>
                      </div>
                      <div style={{ fontSize: "12px", color: "#475569", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{itemsDesc}</div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "#94A3B8" }}>
                        <span>{order.customer?.name || "Client"} · {format(order.createdAt, "HH:mm")}</span>
                        <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--primary)" }}>{order.totalAmount.toLocaleString("fr-DZ")} DA</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Charts & Top Dishes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="charts-grid">

        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.75rem" }}>Revenus 7 derniers jours</h3>
          <div style={{ padding: "16px", background: "white", borderRadius: 18, height: "260px", display: "flex", alignItems: "flex-end", gap: "8px", position: "relative" }}>
            {ordersPerDayData.length === 0 ? (
              <div style={{ width: "100%", textAlign: "center", color: "var(--text-muted)" }}>Aucune donnée</div>
            ) : (
              ordersPerDayData.map((d, i) => {
                const h = Math.max((d.revenue / maxRevenue) * 100, 2);
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end", minWidth: 0 }}>
                    <div style={{ fontSize: "9px", color: "var(--text-muted)", fontWeight: 600, whiteSpace: "nowrap" }}>{d.revenue}</div>
                    <div style={{ width: "100%", maxWidth: "32px", height: `${h}%`, background: "var(--primary)", borderRadius: "4px 4px 0 0" }} />
                    <div style={{ fontSize: "11px", color: "var(--text-secondary)", fontWeight: 500 }}>{d.date}</div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Plats les plus vendus</h3>
            <Link href="/cook/dishes" style={{ color: "var(--primary)", fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>
              Voir tout →
            </Link>
          </div>
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }} className="scrollbar-hide">
            {topDishes.length === 0 ? (
              <div style={{ flex: 1, padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>Aucune vente encore</div>
            ) : topDishes.map((dish, i) => (
              <div key={i} style={{ minWidth: "180px", background: "white", borderRadius: 14, padding: "12px", flexShrink: 0 }}>
                <div style={{ width: "100%", height: "100px", borderRadius: 10, background: dish.img ? `url(${dish.img}) center/cover` : "var(--bg-secondary)", marginBottom: "10px" }} />
                <h4 style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dish.name}</h4>
                <div style={{ fontSize: "12px", color: "#94A3B8" }}>Vendu {dish.count}×</div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--primary)", marginTop: 2 }}>{dish.price.toLocaleString("fr-DZ")} DA</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .charts-grid { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) {
          .cook-orders-table { display: none !important; }
          .cook-orders-cards { display: flex !important; }
        }
        .truncate-text { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  );
}
