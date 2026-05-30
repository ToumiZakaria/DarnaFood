import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  MapPin, Star, ShoppingBag, MessageSquare, UtensilsCrossed,
  CheckCircle, Clock, Share, Heart, ChefHat, ArrowRight
} from "lucide-react";

import { auth } from "@/lib/auth";
import FollowCookButton from "./FollowCookButton";

// ─── Data ─────────────────────────────────────────────────────────────────────

async function getCook(id: string) {
  return prisma.user.findUnique({
    where: { id, role: "COOK" },
    include: {
      cookProfile: true,
      dishes: {
        where: { isAvailable: true },
        include: { category: true, images: { where: { isPrimary: true }, take: 1 } },
        orderBy: { createdAt: "desc" },
        take: 9,
      },
      reviewsReceived: {
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 6,
      },
    },
  });
}



// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const cook = await prisma.user.findUnique({ where: { id, role: "COOK" }, select: { name: true, cookProfile: { select: { wilaya: true } } } });
    if (!cook) return { title: "Cuisinier introuvable" };
    return { title: `${cook.name} — Cuisinier à ${cook.cookProfile?.wilaya} | DarnaFood` };
  } catch {
    return { title: "Cuisinier | DarnaFood" };
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CookPublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const isCook = session?.user?.role === "COOK";

  let cook: any;
  try {
    cook = await getCook(id);
  } catch {}

  if (!cook) {
    notFound();
  }

  const profile = cook.cookProfile;
  const dishes = cook.dishes ?? [];
  const reviews = cook.reviewsReceived ?? [];
  const avgRating = profile?.avgRating ?? 0;
  const totalOrders = profile?.totalOrders ?? 0;
  const totalReviews = reviews.length;
  const userInitial = cook.name?.[0]?.toUpperCase() ?? "C";

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>

      {/* ── Breadcrumb ── */}
      <div style={{ background: "white", borderBottom: "1px solid #E2E8F0", padding: "0.875rem 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem", fontSize: "13px", color: "#94A3B8" }}>
          <Link href="/" style={{ color: "#94A3B8", textDecoration: "none" }}>Accueil</Link>
          <span style={{ margin: "0 0.5rem" }}>›</span>
          <Link href="/cooks" style={{ color: "#94A3B8", textDecoration: "none" }}>Cuisiniers</Link>
          <span style={{ margin: "0 0.5rem" }}>›</span>
          <span style={{ color: "#475569", fontWeight: 500 }}>{cook.name}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "2rem 1.5rem" }}>

        {/* ════ SECTION 1: PROFILE HEADER ════ */}
        <div style={{ background: "white", borderRadius: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden", marginBottom: "2rem", border: "1px solid #F1F5F9" }}>

          {/* Cover */}
          <div style={{ height: 200, background: "linear-gradient(135deg, #FAEEDA, #FFF7ED)", position: "relative" }}>
            <div style={{ position: "absolute", top: "15%", left: "5%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)" }} />
            <div style={{ position: "absolute", bottom: "10%", right: "8%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)" }} />
          </div>

          {/* Profile info row */}
          <div style={{ padding: "0 2rem 2rem", position: "relative", display: "flex", gap: "1.5rem", alignItems: "flex-end", marginTop: "-4rem", flexWrap: "wrap" }}>
            {/* Avatar */}
            <div style={{ width: 128, height: 128, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #EA580C)", border: "4px solid white", boxShadow: "0 8px 24px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "48px", fontWeight: 900, flexShrink: 0 }}>
              {userInitial}
            </div>

            {/* Info */}
            <div style={{ flex: 1, paddingBottom: "0.5rem", minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, color: "#0F172A", margin: 0 }}>{cook.name}</h1>
                {profile?.isVerified && (
                  <span style={{ display: "flex", alignItems: "center", gap: "0.375rem", background: "#F0FDFA", color: "#0D9488", fontSize: "13px", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: 9999 }}>
                    <CheckCircle size={14} /> Vérifié
                  </span>
                )}
              </div>
              {profile && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <MapPin size={15} color="#94A3B8" />
                  <span style={{ fontSize: "15px", fontWeight: 500, color: "#64748B" }}>{profile.wilaya}, {profile.commune}</span>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", marginLeft: 4 }} />
                  <span style={{ fontSize: "13px", color: "#22C55E", fontWeight: 500 }}>En ligne</span>
                </div>
              )}
              {profile?.bio && (
                <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, maxWidth: 560, marginTop: "0.625rem" }}>
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Right actions */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingBottom: "0.5rem", flexShrink: 0 }}>
              <Link href={`/dishes?cook=${cook.id}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", height: 44, padding: "0 1.25rem", borderRadius: 12, background: "#F97316", color: "white", textDecoration: "none", fontSize: "14px", fontWeight: 700, whiteSpace: "nowrap" }}>
                <ShoppingBag size={16} /> Commander un plat
              </Link>
              <FollowCookButton cookId={cook.id} isCook={isCook} />
              <button style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", height: 40, padding: "0 1.25rem", borderRadius: 12, border: "1.5px solid #E2E8F0", background: "white", color: "#475569", fontSize: "14px", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}>
                <Share size={15} /> Partager
              </button>
            </div>
          </div>

          {/* Stats bar */}
          <div style={{ borderTop: "1px solid #F1F5F9", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "1.25rem 2rem", textAlign: "center" }}>
            {[
              { icon: Star, color: "#FBBF24", label: "Note", value: avgRating > 0 ? avgRating.toFixed(1) : "—" },
              { icon: ShoppingBag, color: "#3B82F6", label: "Commandes", value: totalOrders },
              { icon: UtensilsCrossed, color: "#F97316", label: "Plats", value: dishes.length },
              { icon: MessageSquare, color: "#0D9488", label: "Avis", value: totalReviews },
            ].map((s, i) => (
              <div key={s.label} style={{ position: "relative" }}>
                {i > 0 && <div style={{ position: "absolute", left: 0, top: "15%", bottom: "15%", width: 1, background: "#F1F5F9" }} />}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.375rem" }}>
                  <s.icon size={22} color={s.color} />
                  <span style={{ fontSize: "26px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{s.value}</span>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "#94A3B8" }}>{s.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ════ SECTION 2: DISHES ════ */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A" }}>Les plats de {cook.name?.split(" ")[0]}</h2>
            <Link href={`/dishes?cook=${cook.id}`} style={{ fontSize: "14px", fontWeight: 600, color: "#F97316", textDecoration: "none" }}>Voir tout →</Link>
          </div>

          {dishes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: 20, border: "1px solid #F1F5F9" }}>
              <ChefHat size={40} color="#CBD5E1" style={{ margin: "0 auto 1rem" }} />
              <p style={{ fontSize: "16px", color: "#94A3B8" }}>Aucun plat disponible pour le moment</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }} className="cook-dishes-grid">
              {dishes.map((dish: any) => {
                const img = dish.images?.[0]?.url;
                return (
                  <Link key={dish.id} href={`/dishes/${dish.id}`} className="cook-dish-card" style={{ textDecoration: "none", background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", transition: "all 300ms", display: "block" }}>
                    <div style={{ aspectRatio: "4/3", background: "#FAEEDA", overflow: "hidden" }}>
                      {img && <img src={img} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <div style={{ padding: "1rem" }}>
                      <span style={{ fontSize: "11px", fontWeight: 600, background: "#FFF7ED", color: "#EA580C", padding: "2px 8px", borderRadius: 9999 }}>{dish.category?.name}</span>
                      <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", margin: "0.5rem 0 0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dish.name}</h3>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "13px", color: "#94A3B8" }}>
                          <Clock size={12} /> {dish.prepTime} min
                        </div>
                        <span style={{ fontSize: "18px", fontWeight: 800, color: "#F97316" }}>{dish.price} DA</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* ════ SECTION 3: REVIEWS ════ */}
        <div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "1.25rem" }}>Avis clients</h2>

          {/* Rating summary */}
          <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", display: "flex", gap: "3rem", marginBottom: "1.25rem", flexWrap: "wrap", border: "1px solid #F1F5F9", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ textAlign: "center", minWidth: 150 }}>
              <div style={{ fontSize: "64px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{avgRating > 0 ? avgRating.toFixed(1) : "—"}</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 3, margin: "0.5rem 0" }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill="#F97316" color="#F97316" />)}
              </div>
              <div style={{ fontSize: "13px", color: "#64748B" }}>Basé sur {totalReviews} avis</div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.625rem", justifyContent: "center", minWidth: 200 }}>
              {[{ s: 5, p: "75%", c: 18 }, { s: 4, p: "17%", c: 4 }, { s: 3, p: "4%", c: 1 }, { s: 2, p: "4%", c: 1 }, { s: 1, p: "0%", c: 0 }].map(bar => (
                <div key={bar.s} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ width: 28, fontSize: "13px", fontWeight: 600, color: "#0F172A", flexShrink: 0 }}>{bar.s} ★</span>
                  <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 9999, overflow: "hidden" }}>
                    <div style={{ width: bar.p, height: "100%", background: "#F97316", borderRadius: 9999 }} />
                  </div>
                  <span style={{ width: 20, fontSize: "13px", color: "#64748B", textAlign: "right", flexShrink: 0 }}>{bar.c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews list */}
          {reviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: 20, border: "1px solid #F1F5F9" }}>
              <MessageSquare size={40} color="#CBD5E1" style={{ margin: "0 auto 1rem" }} />
              <p style={{ fontSize: "16px", color: "#94A3B8" }}>Aucun avis pour le moment</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {reviews.map((r: any) => (
                <div key={r.id} style={{ background: "white", borderRadius: 20, padding: "1.5rem", display: "flex", gap: "1rem", border: "1px solid #F1F5F9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "15px", fontWeight: 700, color: "#475569", flexShrink: 0 }}>
                    {r.customer?.name?.[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: "15px", color: "#0F172A" }}>{r.customer?.name}</span>
                        <div style={{ display: "flex", gap: 2, marginTop: 3 }}>
                          {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= r.rating ? "#F97316" : "none"} color="#F97316" />)}
                        </div>
                      </div>
                      <span style={{ fontSize: "12px", color: "#94A3B8" }}>il y a 3 jours</span>
                    </div>
                    <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginTop: "0.625rem" }}>{r.comment}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.625rem", fontSize: "12px", fontWeight: 500, color: "#0D9488" }}>
                      <CheckCircle size={13} /> Achat vérifié
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .cook-dishes-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .cook-dishes-grid { grid-template-columns: 1fr !important; }
        }
        .cook-dish-card:hover { box-shadow: 0 10px 25px rgba(0,0,0,0.09) !important; transform: translateY(-3px); }
      `}</style>
    </div>
  );
}
