import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { WILAYA_NAMES } from "@/lib/wilayas";
import { Star, MapPin, CheckCircle, ChefHat, UtensilsCrossed, ArrowLeft, ArrowRight } from "lucide-react";
import CooksSortSelect from "./CooksSortSelect";

export const metadata: Metadata = {
  title: "Nos cuisiniers",
  description: "Découvrez nos cuisiniers locaux algériens et leurs spécialités maison.",
};

const WILAYAS = ["Toutes", ...WILAYA_NAMES];

function cleanParams(params: Record<string, string | undefined>): URLSearchParams {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v) sp.set(k, v); });
  return sp;
}

export default async function CooksPage({
  searchParams,
}: {
  searchParams: Promise<{ wilaya?: string; q?: string; sortBy?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { wilaya, q, sortBy } = params;
  const page = Math.max(1, parseInt(params.page || "1"));

  const where: any = {
    role: "COOK",
    cookProfile: {
      ...(wilaya && wilaya !== "Toutes" ? { wilaya } : {}),
    },
    ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
  };

  const orderBy: any = sortBy === "orders"
    ? { cookProfile: { totalOrders: "desc" as const } }
    : { cookProfile: { avgRating: "desc" as const } };

  const limit = 12;

  async function getCooks() {
    try {
      const [users, count] = await Promise.all([
        prisma.user.findMany({
          where,
          include: {
            cookProfile: true,
            _count: { select: { dishes: { where: { isAvailable: true } } } },
          },
          orderBy,
          skip: (page - 1) * limit,
          take: limit,
        }),
        prisma.user.count({ where }),
      ]);
      return { dbCooks: users, totalCount: count };
    } catch {
      return { dbCooks: [], totalCount: 0 };
    }
  }

  const { dbCooks, totalCount } = await getCooks();

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

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      {/* ── Page Header ── */}
      <div style={{ background: "linear-gradient(135deg, #FAEEDA, #FFF7ED)", padding: "2.5rem 0 1.5rem" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1rem", textAlign: "center" }}>
          <p style={{ fontSize: "12px", fontWeight: 600, color: "#F97316", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>NOS CUISINIERS</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 5vw, 2.75rem)", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>
            Cuisiniers passionnés
          </h1>
          <p style={{ fontSize: "15px", color: "#475569", marginBottom: "1.5rem", maxWidth: 500, margin: "0 auto 1.5rem" }}>
            {totalCount} cuisiniers vérifiés prêts à régaler votre table
          </p>

          {/* Search + Sort */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxWidth: 480, margin: "0 auto" }} className="cooks-search-row">
            <form style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
              <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", background: "white", borderRadius: 14, padding: "0 0.875rem", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}>
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Rechercher un cuisinier…"
                  style={{ flex: 1, minWidth: 0, height: 46, padding: "0 0.75rem", background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "#0F172A" }}
                />
              </div>
              <button type="submit" style={{ height: 46, padding: "0 1.25rem", borderRadius: 14, background: "#F97316", color: "white", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                Chercher
              </button>
            </form>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CooksSortSelect />
            </div>
          </div>
        </div>
      </div>

      {/* ── Wilaya Filter ── */}
      <div style={{ background: "white", borderBottom: "1px solid #E2E8F0", padding: "0.75rem 0", position: "sticky", top: 72, zIndex: 30 }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 1rem", display: "flex", gap: "0.4rem", overflowX: "auto" }} className="scrollbar-hide">
          {WILAYAS.map(w => {
            const isActive = (w === "Toutes" && !wilaya) || wilaya === w;
            return (
              <Link key={w} href={w === "Toutes" ? "/cooks" : `/cooks?wilaya=${w}${q ? `&q=${q}` : ""}`}
                style={{ height: 34, padding: "0 0.75rem", borderRadius: 9999, border: `1.5px solid ${isActive ? "#F97316" : "#E2E8F0"}`, background: isActive ? "#F97316" : "white", color: isActive ? "white" : "#475569", fontSize: "12px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", whiteSpace: "nowrap", transition: "all 150ms", flexShrink: 0 }}>
                {w}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Cooks Grid ── */}
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "1.5rem 1rem" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <ChefHat size={32} color="#F97316" />
            </div>
            <h2 style={{ fontSize: "20px", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>Aucun cuisinier trouvé</h2>
            <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "1.25rem" }}>Essayez une autre ville ou un autre nom</p>
            <Link href="/cooks" style={{ display: "inline-flex", alignItems: "center", height: 42, padding: "0 1.25rem", borderRadius: 12, background: "#F97316", color: "white", textDecoration: "none", fontSize: "14px", fontWeight: 600 }}>
              Voir tous les cuisiniers
            </Link>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }} className="cooks-grid">
              {filtered.map(cook => (
                <div key={cook.id} className="cook-card" style={{ background: "white", borderRadius: 18, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid #F1F5F9", transition: "all 300ms", display: "flex", flexDirection: "column" }}>
                  {/* Avatar */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.875rem" }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #FBBF24)", padding: 2 }}>
                        <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "20px", fontWeight: 800 }}>
                          {cook.initials}
                        </div>
                      </div>
                      <div style={{ position: "absolute", bottom: 1, right: 1, width: 12, height: 12, borderRadius: "50%", background: cook.online ? "#22C55E" : "#CBD5E1", border: "2px solid white" }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "100%" }}>{cook.name}</span>
                        {cook.isVerified && <CheckCircle size={14} color="#0D9488" fill="#0D9488" style={{ color: "white", flexShrink: 0 }} />}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "12px", color: "#94A3B8", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <MapPin size={11} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{cook.wilaya}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {cook.bio && (
                    <p style={{ fontSize: "12px", color: "#64748B", lineHeight: 1.55, marginBottom: "0.875rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {cook.bio}
                    </p>
                  )}

                  {/* Stats */}
                  <div style={{ display: "flex", gap: "0.625rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "12px", fontWeight: 700, color: "#F97316" }}>
                      <Star size={12} fill="#F97316" /> {cook.avgRating > 0 ? cook.avgRating.toFixed(1) : "—"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>{cook.dishCount} plats</div>
                    <div style={{ fontSize: "12px", color: "#94A3B8" }}>{cook.totalOrders} cmd</div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                    <Link href={`/cooks/${cook.id}`} className="profile-link" style={{ flex: 1, minWidth: 0, height: 38, borderRadius: 10, border: "1.5px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600, color: "#475569", textDecoration: "none", transition: "all 150ms" }}>
                      Profil
                    </Link>
                    <Link href={`/dishes?cook=${cook.id}`} style={{ flex: 1, minWidth: 0, height: 38, borderRadius: 10, background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.25rem", fontSize: "12px", fontWeight: 600, color: "white", textDecoration: "none" }}>
                      <UtensilsCrossed size={13} /> Commander
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.375rem", marginTop: "2.5rem", flexWrap: "wrap" }} className="cooks-pagination">
                {page > 1 && (
                  <Link href={`/cooks?${cleanParams({ ...params, page: String(page - 1) }).toString()}`} style={{ height: 38, padding: "0 0.75rem", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "white", color: "#475569", display: "flex", alignItems: "center", gap: 4, fontSize: "13px", fontWeight: 500, textDecoration: "none" }}>
                    <ArrowLeft size={13} /> Précédent
                  </Link>
                )}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => Math.max(1, Math.min(page - 2, totalPages - 4)) + i).map(p => (
                  <Link key={p} href={`/cooks?${cleanParams({ ...params, page: String(p) }).toString()}`} style={{ width: 38, height: 38, borderRadius: 10, background: page === p ? "#F97316" : "white", color: page === p ? "white" : "#475569", fontSize: "13px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: page === p ? "none" : "0 1px 3px rgba(0,0,0,0.05)", border: page === p ? "none" : "1.5px solid #E2E8F0" }}>
                    {p}
                  </Link>
                ))}
                {page < totalPages && (
                  <Link href={`/cooks?${cleanParams({ ...params, page: String(page + 1) }).toString()}`} style={{ height: 38, padding: "0 0.75rem", borderRadius: 10, border: "1.5px solid #E2E8F0", background: "white", color: "#475569", display: "flex", alignItems: "center", gap: 4, fontSize: "13px", fontWeight: 500, textDecoration: "none" }}>
                    Suivant <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .cook-card:hover { box-shadow: 0 10px 25px rgba(0,0,0,0.09) !important; transform: translateY(-3px) !important; }
        .profile-link:hover { border-color: #F97316 !important; color: #F97316 !important; }

        @media (max-width: 480px) {
          .cooks-grid { grid-template-columns: 1fr !important; gap: 0.875rem !important; }
          .cook-card { padding: 1rem !important; border-radius: 16px !important; }
          .cooks-pagination { gap: 0.25rem !important; }
          .cooks-pagination a { width: 34px !important; height: 34px !important; font-size: 12px !important; }
          .cooks-pagination a[style*="height: 38"] { height: 34px !important; padding: 0 0.5rem !important; font-size: 12px !important; }
        }

        @media (min-width: 481px) and (max-width: 768px) {
          .cooks-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }

        @media (min-width: 1024px) {
          .cooks-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important; }
        }
      `}</style>
    </div>
  );
}
