import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WILAYA_NAMES } from "@/lib/wilayas";
import { Star, MapPin, CheckCircle, Search, ChefHat, UtensilsCrossed } from "lucide-react";

export const metadata: Metadata = {
  title: "Nos cuisiniers",
  description: "Découvrez nos cuisiniers locaux algériens et leurs spécialités maison.",
};

const WILAYAS = ["Toutes", ...WILAYA_NAMES];

async function getCooks(wilaya?: string, q?: string) {
  try {
    return await prisma.user.findMany({
      where: {
        role: "COOK",
        cookProfile: {
          ...(wilaya && wilaya !== "Toutes" ? { wilaya } : {})
        },
        ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      },
      include: {
        cookProfile: true,
        _count: { select: { dishes: { where: { isAvailable: true } } } },
      },
      orderBy: { cookProfile: { avgRating: "desc" } },
      take: 24,
    });
  } catch {
    return [];
  }
}

export default async function CooksPage({
  searchParams,
}: {
  searchParams: Promise<{ wilaya?: string; q?: string }>;
}) {
  const { wilaya, q } = await searchParams;
  const dbCooks = await getCooks(wilaya, q);

  const filtered = dbCooks.map((c: any) => ({
    id: c.id,
    name: c.name ?? "Cuisinier",
    initials: (c.name ?? "C")[0].toUpperCase(),
    wilaya: c.cookProfile?.wilaya ?? "",
    commune: c.cookProfile?.commune ?? "",
    avgRating: c.cookProfile?.avgRating ?? 0,
    totalOrders: c.cookProfile?.totalOrders ?? 0,
    dishCount: c._count?.dishes ?? 0,
    online: true,
    isVerified: c.cookProfile?.isVerified ?? false,
    bio: c.cookProfile?.bio ?? "",
  }));

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>

      {/* ── Page Header ── */}
      <div style={{ background: "linear-gradient(135deg, #FAEEDA, #FFF7ED)", padding: "3.5rem 0 2rem" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem", textAlign: "center" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#F97316", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>NOS CUISINIERS</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 5vw, 2.75rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.75rem" }}>
            Cuisiniers passionnés
          </h1>
          <p style={{ fontSize: "16px", color: "#475569", marginBottom: "1.75rem", maxWidth: 500, margin: "0 auto 1.75rem" }}>
            {filtered.length} cuisiniers vérifiés prêts à régaler votre table
          </p>

          {/* Search */}
          <form style={{ maxWidth: 480, margin: "0 auto", display: "flex", gap: "0.625rem" }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", background: "white", borderRadius: 14, padding: "0 0.875rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
              <Search size={18} color="#94A3B8" style={{ flexShrink: 0 }} />
              <input name="q" defaultValue={q} placeholder="Rechercher un cuisinier…" style={{ flex: 1, height: 46, padding: "0 0.75rem", background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "#0F172A" }} />
            </div>
            <button type="submit" style={{ height: 46, padding: "0 1.25rem", borderRadius: 14, background: "#F97316", color: "white", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
              Chercher
            </button>
          </form>
        </div>
      </div>

      {/* ── Wilaya Filter ── */}
      <div style={{ background: "white", borderBottom: "1px solid #E2E8F0", padding: "0.875rem 0", position: "sticky", top: 72, zIndex: 30 }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1.5rem", display: "flex", gap: "0.5rem", overflowX: "auto" }} className="scrollbar-hide">
          {WILAYAS.map(w => {
            const isActive = (w === "Toutes" && !wilaya) || wilaya === w;
            return (
              <Link key={w} href={w === "Toutes" ? "/cooks" : `/cooks?wilaya=${w}`}
                style={{ height: 36, padding: "0 0.875rem", borderRadius: 9999, border: `1.5px solid ${isActive ? "#F97316" : "#E2E8F0"}`, background: isActive ? "#F97316" : "white", color: isActive ? "white" : "#475569", fontSize: "13px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", whiteSpace: "nowrap", transition: "all 150ms", flexShrink: 0 }}>
                {w}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Cooks Grid ── */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "6rem 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <ChefHat size={36} color="#F97316" />
            </div>
            <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "0.75rem" }}>Aucun cuisinier trouvé</h2>
            <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "1.5rem" }}>Essayez une autre ville ou un autre nom</p>
            <Link href="/cooks" style={{ display: "inline-flex", alignItems: "center", height: 44, padding: "0 1.5rem", borderRadius: 12, background: "#F97316", color: "white", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
              Voir tous les cuisiniers
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
            {filtered.map(cook => (
              <div key={cook.id} className="cook-card" style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", transition: "all 300ms", display: "flex", flexDirection: "column" }}>
                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #FBBF24)", padding: 2.5 }}>
                      <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "22px", fontWeight: 800 }}>
                        {cook.initials}
                      </div>
                    </div>
                    <div style={{ position: "absolute", bottom: 1, right: 1, width: 14, height: 14, borderRadius: "50%", background: cook.online ? "#22C55E" : "#CBD5E1", border: "2.5px solid white" }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A" }}>{cook.name}</span>
                      {cook.isVerified && <CheckCircle size={15} color="#0D9488" fill="#0D9488" style={{ color: "white" }} />}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "13px", color: "#94A3B8", marginTop: 3 }}>
                      <MapPin size={12} /> {cook.wilaya}
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {cook.bio && (
                  <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.65, marginBottom: "1rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {cook.bio}
                  </p>
                )}

                {/* Stats */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", fontSize: "13px", fontWeight: 700, color: "#F97316" }}>
                    <Star size={14} fill="#F97316" /> {cook.avgRating > 0 ? cook.avgRating.toFixed(1) : "—"}
                  </div>
                  <div style={{ fontSize: "13px", color: "#94A3B8" }}>{cook.dishCount} plats</div>
                  <div style={{ fontSize: "13px", color: "#94A3B8" }}>{cook.totalOrders} commandes</div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.625rem", marginTop: "auto" }}>
                  <Link href={`/cooks/${cook.id}`} className="profile-link" style={{ flex: 1, height: 40, borderRadius: 12, border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, color: "#475569", textDecoration: "none", transition: "all 150ms" }}>
                    Voir profil
                  </Link>
                  <Link href={`/dishes?cook=${cook.id}`} style={{ flex: 1, height: 40, borderRadius: 12, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem", fontSize: "13px", fontWeight: 600, color: "white", textDecoration: "none" }}>
                    <UtensilsCrossed size={14} /> Commander
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .cook-card:hover { box-shadow: 0 10px 25px rgba(0,0,0,0.09) !important; transform: translateY(-3px) !important; }
        .profile-link:hover { border-color: #F97316 !important; color: #F97316 !important; }
      `}</style>
    </div>
  );
}
