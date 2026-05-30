import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  Star, Clock, MapPin, CheckCircle, ShoppingBag,
  Heart, Share, ArrowLeft, Bike, Store, Users, Leaf
} from "lucide-react";
import { auth } from "@/lib/auth";
import OrderSidebarCard from "./OrderSidebarCard";

// ─── Data Fetching ────────────────────────────────────────────────────────────

async function getDish(id: string) {
  return prisma.dish.findUnique({
    where: { id },
    include: {
      category: true,
      images: { orderBy: { isPrimary: "desc" } },
      cook: {
        include: {
          cookProfile: true,
        },
      },
    },
  });
}

async function getCookReviews(cookId: string) {
  return prisma.review.findMany({
    where: { cookId },
    include: { customer: { select: { name: true, image: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

async function getRelatedDishes(cookId: string, excludeId: string) {
  return prisma.dish.findMany({
    where: { cookId, isAvailable: true, id: { not: excludeId } },
    include: { images: { where: { isPrimary: true }, take: 1 } },
    take: 4,
  });
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const dish = await prisma.dish.findUnique({ where: { id }, select: { name: true, description: true } });
  if (!dish) return { title: "Plat introuvable" };
  return { title: dish.name, description: dish.description };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DishDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const dish = await getDish(id);
  if (!dish) notFound();

  const [reviews, relatedDishes] = await Promise.all([
    getCookReviews(dish.cookId),
    getRelatedDishes(dish.cook.id, id),
  ]);

  const session = await auth();
  const isCook = session?.user?.role === "COOK";

  const primaryImage = dish.images.find(img => img.isPrimary)?.url ?? dish.images[0]?.url;
  const otherImages = dish.images.filter(img => !img.isPrimary).slice(0, 3);
  const rating = dish.cook.cookProfile?.avgRating ?? 0;
  const avgReviewRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const details = [
    { icon: Clock, label: "Préparation", value: `${dish.prepTime} minutes` },
    { icon: Users, label: "Portions", value: "2–4 personnes" },
    { icon: MapPin, label: "Livraison", value: dish.cook.cookProfile?.wilaya ? `${dish.cook.cookProfile.wilaya} · ~45 min` : "Algérie" },
    { icon: Leaf, label: "Catégorie", value: dish.category.name },
    { icon: CheckCircle, label: "Halal", value: "Certifié" },
    { icon: ShoppingBag, label: "Paiement", value: "Cash ou carte" },
  ];

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>

      {/* ── Breadcrumb ── */}
      <div style={{ background: "white", borderBottom: "1px solid #E2E8F0", padding: "0.875rem 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "13px", color: "#94A3B8" }}>
          <Link href="/" style={{ color: "#94A3B8", textDecoration: "none" }}>Accueil</Link>
          <span>›</span>
          <Link href="/dishes" style={{ color: "#94A3B8", textDecoration: "none" }}>Plats</Link>
          <span>›</span>
          <Link href={`/dishes?category=${dish.category.name}`} style={{ color: "#94A3B8", textDecoration: "none" }}>{dish.category.name}</Link>
          <span>›</span>
          <span style={{ color: "#475569", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dish.name}</span>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "2rem 1.5rem", display: "grid", gridTemplateColumns: "1fr 400px", gap: "2.5rem", alignItems: "flex-start" }} className="dish-detail-grid">

        {/* ══ LEFT COLUMN ══ */}
        <div>
          {/* 1. Image Gallery */}
          <div style={{ borderRadius: 20, overflow: "hidden", background: "#FAEEDA", aspectRatio: "16/10", position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            {primaryImage ? (
              <img src={primaryImage} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>🍽️</div>
            )}
            {!dish.isAvailable && (
              <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.55)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ background: "white", color: "#0F172A", fontSize: "16px", fontWeight: 700, padding: "0.75rem 1.5rem", borderRadius: 12 }}>Indisponible actuellement</span>
              </div>
            )}
          </div>
          {/* Thumbnails */}
          {otherImages.length > 0 && (
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.875rem" }}>
              {[{ url: primaryImage, isPrimary: true }, ...otherImages].slice(0, 4).map((img, i) => (
                <div key={i} style={{ width: 80, height: 64, borderRadius: 12, overflow: "hidden", border: i === 0 ? "2.5px solid #F97316" : "2.5px solid transparent", cursor: "pointer", flexShrink: 0 }}>
                  {img?.url && <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                </div>
              ))}
            </div>
          )}

          {/* 2. Dish Header */}
          <div style={{ marginTop: "2rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.875rem" }}>
              <span style={{ background: "#FFF7ED", color: "#EA580C", border: "1px solid #FBBF24", fontSize: "12px", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: 9999 }}>{dish.category.name}</span>
              {dish.isAvailable && <span style={{ background: "#F97316", color: "white", fontSize: "12px", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: 9999 }}>Disponible</span>}
              {dish.cook.cookProfile?.isVerified && <span style={{ background: "#F0FDFA", color: "#0D9488", fontSize: "12px", fontWeight: 600, padding: "0.25rem 0.75rem", borderRadius: 9999, display: "flex", alignItems: "center", gap: 4 }}><CheckCircle size={12} /> Vérifié</span>}
            </div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, marginBottom: "0.75rem" }}>{dish.name}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", fontSize: "15px", color: "#475569" }}>
              <div style={{ display: "flex", gap: 2 }}>
                {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= Math.round(avgReviewRating || rating) ? "#F97316" : "none"} color="#F97316" />)}
              </div>
              <span style={{ fontWeight: 700, color: "#0F172A" }}>{rating > 0 ? rating.toFixed(1) : "—"}</span>
              {reviews.length > 0 && <span style={{ color: "#94A3B8" }}>· {reviews.length} avis vérifiés</span>}
              {reviews.length > 0 && <a href="#reviews" style={{ color: "#F97316", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>Voir les avis ↓</a>}
            </div>
          </div>

          {/* 3. Description */}
          <div style={{ marginTop: "1.5rem" }}>
            <p style={{ fontSize: "16px", color: "#475569", lineHeight: 1.8, maxWidth: 640 }}>{dish.description}</p>
          </div>

          {/* 4. Details Grid */}
          <div style={{ marginTop: "1.75rem", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }} className="details-grid">
            {details.map(d => (
              <div key={d.label} style={{ background: "white", borderRadius: 14, padding: "1rem", border: "1px solid #F1F5F9", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <d.icon size={18} color="#F97316" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{d.label}</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A", marginTop: 2 }}>{d.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 5. Cook Card */}
          <div style={{ marginTop: "2rem", background: "white", borderRadius: 20, padding: "1.5rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #EA580C)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "24px", fontWeight: 800, flexShrink: 0 }}>
                {dish.cook.name?.[0]?.toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A" }}>{dish.cook.name}</span>
                  {dish.cook.cookProfile?.isVerified && <CheckCircle size={16} color="#0D9488" />}
                </div>
                <div style={{ fontSize: "14px", color: "#64748B", marginTop: 3 }}>
                  {dish.cook.cookProfile?.wilaya} · {rating > 0 ? `${rating.toFixed(1)} ★` : ""} {reviews.length > 0 ? `(${reviews.length} avis)` : ""}
                </div>
                {dish.cook.cookProfile?.bio && (
                  <p style={{ fontSize: "14px", color: "#94A3B8", marginTop: "0.5rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {dish.cook.cookProfile.bio}
                  </p>
                )}
                <Link href={`/cooks/${dish.cook.id}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "14px", fontWeight: 600, color: "#F97316", textDecoration: "none", marginTop: "0.625rem" }}>
                  Voir son profil →
                </Link>
              </div>
              <Link href={`/cooks/${dish.cook.id}`} style={{ height: 40, padding: "0 1rem", borderRadius: 12, border: "1.5px solid #F97316", color: "#F97316", fontSize: "13px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
                Suivre
              </Link>
            </div>
          </div>

          {/* 6. Reviews */}
          {reviews.length > 0 && (
            <div id="reviews" style={{ marginTop: "2.5rem" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A", marginBottom: "1.25rem" }}>Avis clients</h2>
              {/* Rating summary */}
              <div style={{ background: "white", borderRadius: 20, padding: "1.5rem", display: "flex", gap: "2.5rem", marginBottom: "1.25rem", flexWrap: "wrap", border: "1px solid #F1F5F9" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "56px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{avgReviewRating > 0 ? avgReviewRating.toFixed(1) : "—"}</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 3, margin: "0.5rem 0" }}>
                    {[1,2,3,4,5].map(s => <Star key={s} size={16} fill="#F97316" color="#F97316" />)}
                  </div>
                  <div style={{ fontSize: "13px", color: "#64748B" }}>{reviews.length} avis vérifiés</div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem", justifyContent: "center", minWidth: 160 }}>
                  {[5,4,3,2,1].map(s => {
                    const cnt = reviews.filter(r => r.rating === s).length;
                    const pct = reviews.length > 0 ? Math.round((cnt / reviews.length) * 100) : 0;
                    return (
                      <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                        <span style={{ width: 24, fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>{s} ★</span>
                        <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 9999 }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: "#F97316", borderRadius: 9999 }} />
                        </div>
                        <span style={{ width: 28, fontSize: "12px", color: "#64748B", textAlign: "right" }}>{cnt}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ background: "white", borderRadius: 16, padding: "1.25rem", border: "1px solid #F1F5F9" }}>
                    <div style={{ display: "flex", gap: "0.875rem" }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 700, flexShrink: 0 }}>
                        {r.customer.name?.[0] ?? "?"}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.375rem" }}>
                          <span style={{ fontWeight: 700, fontSize: "14px", color: "#0F172A" }}>{r.customer.name}</span>
                          <div style={{ display: "flex", gap: 2 }}>
                            {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= r.rating ? "#F97316" : "none"} color="#F97316" />)}
                          </div>
                        </div>
                        <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.7, marginTop: "0.5rem" }}>{r.comment ?? "Très bon plat."}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "0.5rem", fontSize: "12px", fontWeight: 500, color: "#0D9488" }}>
                          <CheckCircle size={12} /> Achat vérifié
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Related Dishes */}
          {relatedDishes.length > 0 && (
            <div style={{ marginTop: "2.5rem" }}>
              <h3 style={{ fontSize: "1.375rem", fontWeight: 700, color: "#0F172A", marginBottom: "1.25rem" }}>
                D&apos;autres plats de {dish.cook.name?.split(" ")[0]}
              </h3>
              <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "0.5rem" }} className="scrollbar-hide">
                {relatedDishes.map((rd: any) => {
                  const img = rd.images?.[0]?.url;
                  return (
                    <Link key={rd.id} href={`/dishes/${rd.id}`} className="related-dish-card" style={{ textDecoration: "none", background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #F1F5F9", minWidth: 200, maxWidth: 220, flexShrink: 0, transition: "all 200ms", display: "block" }}>
                      <div style={{ height: 120, background: "#FAEEDA", overflow: "hidden" }}>
                        {img && <img src={img} alt={rd.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                      </div>
                      <div style={{ padding: "0.875rem" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{rd.name}</div>
                        <div style={{ fontSize: "16px", fontWeight: 800, color: "#F97316", marginTop: "0.375rem" }}>{rd.price} DA</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* ══ RIGHT COLUMN — Sticky Order Card ══ */}
        <div style={{ position: "sticky", top: "calc(72px + 1.5rem)" }}>
          <OrderSidebarCard
            dish={{
              id: dish.id,
              name: dish.name,
              price: dish.price,
              cookId: dish.cook.id,
              cookName: dish.cook.name ?? "",
              image: primaryImage,
              isAvailable: dish.isAvailable,
            }}
            isCook={isCook}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dish-detail-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .details-grid { grid-template-columns: 1fr 1fr !important; }
        }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .related-dish-card { transition: all 200ms; }
        .related-dish-card:hover { transform: translateY(-3px); }
        .add-fav-btn { transition: all 150ms; }
        .add-fav-btn:hover { background: #F0FDFA !important; }
      `}</style>
    </div>
  );
}
