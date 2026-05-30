import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WILAYA_NAMES } from "@/lib/wilayas";
import {
  Star, Clock, MapPin, ChefHat,
  UtensilsCrossed, Wheat, Flame, CookingPot, Coffee, Leaf,
  PartyPopper, ArrowRight, ShoppingCart
} from "lucide-react";
import HomeClient from "@/app/(home)/HomeClient";

export const metadata: Metadata = {
  title: "DarnaFood — Plats faits maison en Algérie",
  description: "Commandez des plats faits maison préparés par des cuisiniers locaux algériens. Livraison ou retrait disponible dans votre ville.",
};

const CATEGORIES = [
  { label: "Tous les plats", slug: null, icon: UtensilsCrossed },
  { label: "Boissons", slug: "boissons", icon: Coffee },
  { label: "Chorba", slug: "chorba", icon: Flame },
  { label: "Couscous", slug: "couscous", icon: Wheat },
  { label: "Grillades", slug: "grillades", icon: Flame },
  { label: "Pâtisserie", slug: "patisserie", icon: Coffee },
  { label: "Plats de fête", slug: "plats-de-fete", icon: PartyPopper },
  { label: "Salades", slug: "salades", icon: Leaf },
  { label: "Tajine", slug: "tajine", icon: CookingPot },
];

export default async function HomePage() {
  // Real counts from DB
  let dishCount = 0, cookCount = 0;
  try {
    [dishCount, cookCount] = await Promise.all([
      prisma.dish.count({ where: { isAvailable: true } }),
      prisma.cookProfile.count({ where: { isVerified: true } }),
    ]);
  } catch {}

  // Fetch real dishes from DB for homepage
  let dishesToShow: any[] = [];
  try {
    const dbDishes = await prisma.dish.findMany({
      where: { isAvailable: true },
      include: {
        cook: { select: { id: true, name: true, cookProfile: { select: { wilaya: true, avgRating: true } } } },
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    });
    dishesToShow = dbDishes.map(d => ({
      id: d.id,
      name: d.name,
      cook: d.cook.name ?? "Cuisinier",
      city: d.cook.cookProfile?.wilaya ?? "Relizane",
      rating: d.cook.cookProfile?.avgRating ?? 0,
      reviews: 0,
      price: d.price,
      prepTime: d.prepTime,
      badge: "Nouveau",
      category: d.category.name,
      image: d.images[0]?.url ?? null,
    }));
  } catch {}

  // Fetch real cooks for homepage
  let cooksToShow: any[] = [];
  try {
    const dbCooks = await prisma.user.findMany({
      where: { role: "COOK" },
      include: {
        cookProfile: true,
        _count: { select: { dishes: { where: { isAvailable: true } } } },
      },
      take: 6,
    });
    cooksToShow = dbCooks.map(c => ({
      id: c.id,
      initials: (c.name ?? "C")[0].toUpperCase(),
      name: c.name ?? "Cuisinier",
      city: c.cookProfile?.wilaya ?? "Relizane",
      rating: c.cookProfile?.avgRating ?? 0,
      dishes: c._count?.dishes ?? 0,
      online: true,
    }));
  } catch {}

  return (
    <div style={{ background: "#F8FAFC", paddingTop: 72 }}>

      {/* ═══ HERO ═══ */}
      <section style={{
        background: "linear-gradient(135deg, #FAEEDA 0%, #FFF7ED 40%, #F8FAFC 100%)",
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <div style={{ position: "absolute", top: "10%", left: "-8%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "5%", right: "-5%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: "40%", right: "20%", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)" }} />
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center", padding: "5rem 1.5rem", position: "relative", zIndex: 1, width: "100%" }}>

          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.85)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 9999, padding: "0.375rem 1rem", marginBottom: "1.5rem" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F97316" }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#F97316", letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Cuisine Algérienne Authentique
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2.25rem, 6vw, 3.75rem)", fontWeight: 900, color: "#0F172A", lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "1.5rem" }}>
            Le goût du fait maison,<br />
            livré chez <span style={{ color: "#F97316", position: "relative" }}>vous</span>
          </h1>

          {/* Subline */}
          <p style={{ fontSize: "clamp(1rem, 2.5vw, 1.25rem)", color: "#475569", lineHeight: 1.6, maxWidth: 620, margin: "0 auto 2.5rem" }}>
            Découvrez des centaines de plats traditionnels et modernes préparés avec soin par des cuisiniers passionnés dans votre wilaya.
          </p>

          {/* Search Bar */}
          <HomeClient cities={WILAYA_NAMES} />
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" style={{ background: "white", padding: "5rem 0", borderBottom: "1px solid #F1F5F9" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#F97316", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>FONCTIONNEMENT</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, color: "#0F172A" }}>Comment commander ?</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2.5rem" }} className="how-grid">
            {[
              { step: "01", title: "Choisissez un plat", desc: "Parcourez les spécialités maison préparées près de chez vous." },
              { step: "02", title: "Commandez en ligne", desc: "Sélectionnez vos options, l'heure de retrait ou de livraison." },
              { step: "03", title: "Régalez-vous", desc: "Récupérez chaud ou faites-vous livrer directement chez vous." },
            ].map(item => (
              <div key={item.step} style={{ position: "relative", padding: "2rem", borderRadius: 24, background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "3rem", fontWeight: 900, color: "rgba(249,115,22,0.15)", position: "absolute", top: 15, right: 20 }}>{item.step}</div>
                <h3 style={{ fontSize: "18px", fontWeight: 800, color: "#0F172A", marginBottom: "0.75rem", marginTop: "1rem" }}>{item.title}</h3>
                <p style={{ fontSize: "14px", color: "#64748B", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section style={{ background: "#F8FAFC", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#F97316", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>CATÉGORIES</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.75rem" }}>Tous les goûts algériens</h2>
            <p style={{ fontSize: "16px", color: "#475569" }}>Des couscous aux pâtisseries, trouvez votre plat préféré</p>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat, i) => (
              <Link key={cat.label} href={cat.slug ? `/dishes?category=${cat.slug}` : "/dishes"}
                className={i === 0 ? "" : "home-cat-chip"}
                style={{ height: 48, borderRadius: 9999, border: i === 0 ? "none" : "1.5px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.5rem", padding: "0 1.25rem", fontSize: "14px", fontWeight: 600, textDecoration: "none", transition: "all 200ms", background: i === 0 ? "#F97316" : "white", color: i === 0 ? "white" : "#475569", boxShadow: i === 0 ? "0 2px 8px rgba(249,115,22,0.3)" : "none" }}
              >
                <cat.icon size={18} />
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURED DISHES ═══ */}
      <section style={{ background: "white", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "12px", fontWeight: 600, color: "#F97316", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>PLATS POPULAIRES</p>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>Plats à la une</h2>
              <p style={{ fontSize: "16px", color: "#475569" }}>Des plats préparés avec amour par nos meilleurs cuisiniers locaux</p>
            </div>
            <Link href="/dishes" className="home-view-all-link" style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "15px", fontWeight: 600, color: "#F97316", textDecoration: "none" }}>
              Voir tous les plats <ArrowRight size={16} style={{ transition: "transform 200ms" }} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="dish-grid-home">
            {dishesToShow.map(dish => (
              <Link key={dish.id} href={`/dishes/${dish.id}`} className="home-dish-card" style={{ textDecoration: "none", display: "block", background: "white", borderRadius: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflow: "hidden", border: "1px solid #F1F5F9", transition: "all 300ms" }}>
                {/* Image area */}
                <div style={{ aspectRatio: "4/3", position: "relative", overflow: "hidden", background: "#FAEEDA" }}>
                  {dish.image ? (
                    <img src={dish.image} alt={dish.name} className="home-dish-image" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 500ms" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "3rem" }}>🍽️</div>
                  )}
                  {dish.badge && (
                    <div style={{ position: "absolute", top: 10, left: 10, background: dish.badge === "Populaire" ? "#EF4444" : "#F97316", color: "white", fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: 9999 }}>
                      {dish.badge}
                    </div>
                  )}
                  <div className="home-dish-fav-btn" style={{ position: "absolute", top: 10, right: 10, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.95)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", transition: "transform 150ms" }}>
                    ♡
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: "1.125rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#F97316", color: "white", fontSize: "11px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {dish.cook[0]}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#475569" }}>{dish.cook}</span>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#0D9488", marginLeft: 2, flexShrink: 0 }} />
                    <span style={{ fontSize: "13px", color: "#94A3B8", marginLeft: -2 }}>· {dish.city}</span>
                  </div>
                  <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", lineHeight: 1.35, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", marginBottom: "0.5rem" }}>{dish.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "13px", color: "#94A3B8", marginBottom: "0.875rem" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={12} /> {dish.prepTime} min</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 3, color: "#F97316" }}><Star size={12} fill="#F97316" /> {dish.rating}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "22px", fontWeight: 800, color: "#F97316" }}>{dish.price}</span>
                      <span style={{ fontSize: "14px", fontWeight: 500, color: "#94A3B8", marginLeft: 4 }}>DA</span>
                    </div>
                    <div className="home-dish-add-btn" style={{ height: 36, padding: "0 1rem", borderRadius: 9999, background: "#F97316", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "background 150ms" }}>
                      + Ajouter
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TOP COOKS ═══ */}
      <section style={{ background: "#F8FAFC", padding: "5rem 0" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, color: "#0F172A" }}>Nos meilleurs cuisiniers</h2>
            <Link href="/cooks" style={{ fontSize: "15px", fontWeight: 600, color: "#F97316", textDecoration: "none" }}>Voir tous →</Link>
          </div>

          <div style={{ display: "flex", gap: "1.25rem", overflowX: "auto", paddingBottom: "1rem" }} className="scrollbar-hide">
            {cooksToShow.map(cook => (
              <Link key={cook.id} href={`/cooks/${cook.id}`} className="home-cook-card" style={{ textDecoration: "none", background: "white", borderRadius: 20, padding: "1.5rem", minWidth: 200, textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", transition: "all 300ms", display: "block", flexShrink: 0 }}>
                <div style={{ position: "relative", width: 72, height: 72, margin: "0 auto 1rem" }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #FBBF24)", padding: 3 }}>
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "1.5rem", fontWeight: 800 }}>
                      {cook.initials}
                    </div>
                  </div>
                  {cook.online && (
                    <div style={{ position: "absolute", bottom: 2, right: 2, width: 14, height: 14, borderRadius: "50%", background: "#22C55E", border: "2px solid white" }} />
                  )}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", marginBottom: "0.25rem" }}>{cook.name}</div>
                <div style={{ fontSize: "14px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: "0.5rem" }}><MapPin size={13} />{cook.city}</div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: "0.25rem" }}><Star size={14} fill="#F97316" /> {cook.rating}</div>
                <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "1rem" }}>{cook.dishes} plats</div>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "#F97316" }}>Voir profil →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section style={{ background: "#F97316", padding: "4rem 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: 800, color: "white", marginBottom: "1rem" }}>
            Vous cuisinez ? Rejoignez DarnaFood
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, maxWidth: 500, margin: "0 auto 2rem" }}>
            Vendez vos plats faits maison et gagnez de l&apos;argent depuis chez vous. Des milliers de clients vous attendent.
          </p>
          <Link href="/auth/register" className="home-cta-btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", height: 52, padding: "0 2rem", borderRadius: 14, background: "white", color: "#F97316", fontSize: "15px", fontWeight: 700, textDecoration: "none", transition: "all 200ms", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            Devenir cuisinier <ArrowRight size={18} />
          </Link>
        </div>
      </section>



      {/* ═══ NEWSLETTER ═══ */}
      <section style={{ background: "#FAEEDA", padding: "4rem 0" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem, 4vw, 1.75rem)", fontWeight: 700, color: "#0F172A", marginBottom: "0.75rem" }}>Ne manquez aucune nouveauté</h3>
          <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginBottom: "1.5rem" }}>Inscrivez-vous pour recevoir les nouveaux plats et promotions près de chez vous.</p>
          <form style={{ display: "flex", gap: "0.75rem", maxWidth: 420, margin: "0 auto" }}>
            <input type="email" placeholder="votre@email.com" style={{ flex: 1, height: 48, borderRadius: 12, border: "2px solid #E2E8F0", padding: "0 1rem", fontSize: "14px", outline: "none", background: "white", transition: "border-color 150ms" }} />
            <button type="button" className="home-news-btn" style={{ height: 48, padding: "0 1.5rem", borderRadius: 12, background: "#F97316", color: "white", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "background 150ms", whiteSpace: "nowrap" }}>
              S&apos;inscrire
            </button>
          </form>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .dish-grid-home { grid-template-columns: repeat(2, 1fr) !important; }
          .how-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .dish-grid-home { grid-template-columns: 1fr !important; }
        }
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        
        .home-cat-chip { transition: all 200ms; }
        .home-cat-chip:hover { border-color: #F97316 !important; color: #F97316 !important; box-shadow: 0 2px 8px rgba(249,115,22,0.12); }
        
        .home-view-all-link:hover svg { transform: translateX(4px); }
        
        .home-dish-card { transition: all 300ms; }
        .home-dish-card:hover { box-shadow: 0 10px 25px rgba(0,0,0,0.09) !important; transform: translateY(-3px); }
        .home-dish-card:hover .home-dish-image { transform: scale(1.05); }
        
        .home-dish-fav-btn { transition: transform 150ms; }
        .home-dish-fav-btn:hover { transform: scale(1.1) !important; }
        
        .home-dish-add-btn { transition: background 150ms; }
        .home-dish-add-btn:hover { background: #EA580C !important; }
        
        .home-cook-card { transition: all 300ms; }
        .home-cook-card:hover { box-shadow: 0 10px 25px rgba(0,0,0,0.09) !important; transform: translateY(-3px); }
        
        .home-cta-btn { transition: all 200ms; }
        .home-cta-btn:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; transform: translateY(-2px); }
        
        .home-news-btn { transition: background 150ms; }
        .home-news-btn:hover { background: #EA580C !important; }
      `}</style>
    </div>
  );
}
