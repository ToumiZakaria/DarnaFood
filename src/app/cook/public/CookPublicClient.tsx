"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  Camera, MapPin, Edit, Copy, Share, Star, ShoppingBag, UtensilsCrossed, MessageSquare,
  Plus, Search, ChevronDown, CheckCircle, TrendingUp, Eye, FileText, Settings, Link as LinkIcon
} from "lucide-react";

export default function CookPublicClient({ user, profile, dishes, reviews, stats }: any) {
  const [activeTab, setActiveTab] = useState("plats");

  const specialties = ["Couscous", "Tajine", "Pâtisserie", "Cuisine kabyle"];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/cooks/${user.id}`);
    toast.success("Lien copié !");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* ════════════════════════════════════════
          SECTION 1 — PROFILE HEADER
          ════════════════════════════════════════ */}
      <div className="card" style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        {/* Cover Area */}
        <div className="cook-public-cover" style={{ height: 200, background: "linear-gradient(135deg, #FAEEDA, #FFF7ED)", position: "relative", display: "flex", justifyContent: "flex-end", padding: "1rem" }}>
          <button className="btn btn-ghost" style={{ background: "rgba(255,255,255,0.9)", height: 36, fontSize: "13px", boxShadow: "var(--shadow-sm)" }}>
            Modifier la bannière
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="cook-public-profile-row" style={{ padding: "0 2rem 2rem", position: "relative", display: "flex", gap: "1.5rem", alignItems: "flex-end", marginTop: "-4rem" }}>
          
          {/* Avatar */}
          <div className="cook-public-avatar" style={{ position: "relative", flexShrink: 0, textAlign: "center" }}>
            <div style={{ width: 128, height: 128, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #EA580C)", border: "4px solid white", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
              {user.image ? (
                <Image src={user.image} alt="Avatar" fill style={{ objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: "48px", fontWeight: 900, color: "white" }}>
                  {user.name?.[0]?.toUpperCase() ?? "C"}
                </span>
              )}
            </div>
            <button style={{ position: "absolute", bottom: 20, right: 0, width: 36, height: 36, borderRadius: "50%", background: "white", border: "2px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", cursor: "pointer" }}>
              <Camera size={16} />
            </button>
            <div style={{ marginTop: "0.25rem", fontSize: "12px", fontWeight: 500, color: "#94A3B8" }}>Changer</div>
          </div>

          {/* Center Info */}
          <div style={{ flex: 1, paddingBottom: "0.5rem" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 800, color: "#0F172A", margin: 0, lineHeight: 1.2 }}>
              {user.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
              <MapPin size={16} color="#94A3B8" />
              <span style={{ fontSize: "15px", fontWeight: 500, color: "#64748B" }}>
                {profile.wilaya}, {profile.commune}
              </span>
              <span style={{ margin: "0 8px", color: "#CBD5E1" }}>•</span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: 500, color: "var(--success)" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--success)" }} /> En ligne
              </span>
            </div>
            <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, maxWidth: 600, marginTop: "0.5rem", marginBottom: 0 }}>
              {profile.bio || "Aucune biographie."}
            </p>
            <Link href="/cook/profile" style={{ fontSize: "13px", fontWeight: 600, color: "var(--primary)", display: "inline-block", marginTop: "4px" }}>
              Modifier la bio →
            </Link>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" }}>
              {specialties.map(spec => (
                <span key={spec} style={{ background: "#FAEEDA", color: "#633806", fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "9999px" }}>
                  {spec}
                </span>
              ))}
              <button style={{ background: "transparent", border: "1px dashed #CBD5E1", color: "#94A3B8", fontSize: "12px", fontWeight: 600, padding: "4px 12px", borderRadius: "9999px", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }} className="hover-border-primary">
                <Plus size={12} /> Ajouter
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="cook-public-actions" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingBottom: "0.5rem" }}>
            <Link href="/cook/profile" className="btn btn-primary" style={{ height: 40, borderRadius: "12px", padding: "0 20px", background: "transparent", color: "var(--primary)", border: "2px solid var(--primary)" }}>
              <Edit size={16} /> Modifier le profil
            </Link>
            <button onClick={handleCopyLink} className="btn btn-secondary" style={{ height: 40, borderRadius: "12px", padding: "0 20px" }}>
              <Copy size={16} /> Copier le lien
            </button>
            <button className="btn btn-secondary" style={{ height: 40, borderRadius: "12px", padding: "0 20px" }}>
              <Share size={16} /> Partager
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="cook-public-stats-bar" style={{ borderTop: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "1.25rem 2rem", textAlign: "center" }}>
          {[
            { icon: Star, color: "#FBBF24", label: "Note", value: stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—", trend: "+0.2" },
            { icon: ShoppingBag, color: "#3B82F6", label: "Commandes", value: stats.totalOrders, trend: "" },
            { icon: UtensilsCrossed, color: "#F97316", label: "Plats", value: stats.totalDishes, trend: "" },
            { icon: MessageSquare, color: "#0D9488", label: "Avis", value: stats.totalReviews, trend: "" },
          ].map((s, i) => (
            <div key={s.label} style={{ position: "relative" }}>
              {i > 0 && <div style={{ position: "absolute", left: 0, top: "10%", bottom: "10%", width: 1, background: "var(--border)" }} />}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <s.icon size={24} color={s.color} style={{ marginBottom: "4px" }} />
                <div style={{ display: "flex", alignItems: "flex-start", gap: "4px" }}>
                  <span style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{s.value}</span>
                  {s.trend && <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--success)" }}>{s.trend}</span>}
                </div>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "#94A3B8" }}>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          SECTION 2 — MANAGEMENT TABS + CONTENT
          ════════════════════════════════════════ */}
      <div className="cook-public-tabs-strip" style={{ position: "sticky", top: 64, zIndex: 30, background: "rgba(248, 250, 252, 0.95)", backdropFilter: "blur(8px)", padding: "12px 0" }}>
        <div style={{ display: "flex", gap: "4px", background: "white", padding: "4px", borderRadius: "16px", width: "fit-content", boxShadow: "var(--shadow-sm)" }}>
          {[
            { id: "plats", label: `Mes plats (${stats.totalDishes})` },
            { id: "avis", label: `Avis (${stats.totalReviews})` },
            { id: "stats", label: "Statistiques" },
            { id: "settings", label: "Paramètres" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                height: 40, padding: "0 16px", borderRadius: "12px", fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer", transition: "all 0.2s",
                background: activeTab === t.id ? "var(--primary)" : "transparent",
                color: activeTab === t.id ? "white" : "#64748B",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        {/* ── TAB 1: MES PLATS ── */}
        {activeTab === "plats" && (
          <div>
            <div className="cook-public-tab-content-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", gap: "1.5rem" }}>
                {["Tous", "Disponibles", "Épuisés"].map((tab, i) => (
                  <button key={tab} style={{ fontSize: "14px", fontWeight: 500, paddingBottom: "8px", borderBottom: i === 0 ? "2px solid var(--primary)" : "2px solid transparent", color: i === 0 ? "#0F172A" : "#94A3B8", background: "transparent", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer" }}>
                    {tab}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn btn-secondary" style={{ height: 40, borderRadius: "12px" }}>Gérer les catégories</button>
                <Link href="/cook/dishes/new" className="btn btn-primary" style={{ height: 40, borderRadius: "12px" }}><Plus size={16} /> Ajouter un plat</Link>
              </div>
            </div>

            {dishes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "5rem 0" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#FAEEDA", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
                  <UtensilsCrossed size={32} />
                </div>
                <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "8px" }}>Aucun plat publié</h3>
                <p style={{ fontSize: "15px", color: "#64748B", maxWidth: 400, margin: "0 auto 1.5rem" }}>Commencez par ajouter votre premier plat pour attirer des clients.</p>
                <Link href="/cook/dishes/new" className="btn btn-primary btn-lg" style={{ borderRadius: "16px" }}><Plus size={18} /> Ajouter mon premier plat</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
                {dishes.map((dish: any) => {
                  const image = dish.images.find((i: any) => i.isPrimary)?.url || dish.images[0]?.url;
                  return (
                    <div key={dish.id} className="card group" style={{ background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
                      <div style={{ aspectRatio: "4/3", position: "relative", background: image ? `url(${image}) center/cover` : "linear-gradient(135deg, #FAEEDA, #FFF7ED)" }}>
                        <div style={{ position: "absolute", top: 12, left: 12, background: "#FFF7ED", color: "#EA580C", fontSize: "12px", fontWeight: 600, padding: "4px 10px", borderRadius: "9999px" }}>
                          {dish.category.name}
                        </div>
                        <div style={{ position: "absolute", top: 12, right: 12, background: "white", padding: "4px 10px", borderRadius: "9999px", display: "flex", alignItems: "center", gap: "6px", boxShadow: "var(--shadow-sm)" }}>
                          <span style={{ width: 8, height: 8, borderRadius: "50%", background: dish.isAvailable ? "var(--success)" : "var(--error)" }} />
                          <span style={{ fontSize: "12px", fontWeight: 600, color: "#0F172A" }}>{dish.isAvailable ? "Disponible" : "Épuisé"}</span>
                        </div>
                        <div style={{ position: "absolute", bottom: 12, right: 12, color: "white", fontSize: "12px", fontWeight: 600, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                          <Eye size={12} style={{ display: "inline", marginRight: 4 }} /> 142 vues
                        </div>
                      </div>
                      <div style={{ padding: "1.25rem" }}>
                        <h4 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: "0 0 4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{dish.name}</h4>
                        <p style={{ fontSize: "14px", color: "#64748B", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{dish.description}</p>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" }}>
                          <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--primary)" }}>{dish.price} DA</div>
                          <div style={{ fontSize: "13px", color: "#94A3B8" }}>par portion</div>
                        </div>
                        <div style={{ display: "flex", gap: "12px", marginTop: "12px", fontSize: "13px", fontWeight: 500, color: "#64748B" }}>
                          <span>⏱ {dish.prepTime} min</span>
                          <span>📦 12 vendus</span>
                          <span style={{ color: "var(--primary)" }}>★ 4.8</span>
                        </div>
                        <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
                          <Link href={`/cook/dishes/${dish.id}/edit`} className="btn" style={{ flex: 1, height: 36, borderRadius: "8px", border: "1px solid var(--primary)", color: "var(--primary)", background: "transparent", fontSize: "13px" }}>Modifier</Link>
                          <Link href={`/dishes/${dish.id}`} className="btn" style={{ flex: 1, height: 36, borderRadius: "8px", border: "1px solid var(--border)", color: "#475569", background: "transparent", fontSize: "13px" }}>Aperçu</Link>
                          <button className="btn" style={{ width: 36, height: 36, borderRadius: "8px", border: "none", background: "#F1F5F9", color: "#475569", padding: 0, flexShrink: 0 }}><ChevronDown size={16} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: AVIS ── */}
        {activeTab === "avis" && (
          <div>
            <div className="card cook-public-rating-distribution" style={{ background: "white", borderRadius: "20px", padding: "2rem", display: "flex", gap: "3rem", marginBottom: "1.5rem", boxShadow: "var(--shadow-card)" }}>
              <div style={{ textAlign: "center", minWidth: 200 }}>
                <div className="cook-public-rating-big" style={{ fontSize: "72px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "0"}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: "4px", margin: "8px 0" }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={24} fill="var(--primary)" color="var(--primary)" />)}
                </div>
                <div style={{ fontSize: "14px", color: "#64748B" }}>Basé sur {stats.totalReviews} avis vérifiés</div>
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" }}>
                {[ { s: 5, p: "75%", c: 18 }, { s: 4, p: "17%", c: 4 }, { s: 3, p: "4%", c: 1 }, { s: 2, p: "4%", c: 1 }, { s: 1, p: "0%", c: 0 } ].map(bar => (
                  <div key={bar.s} style={{ display: "flex", alignItems: "center", gap: "12px", height: 32 }}>
                    <div style={{ width: 32, fontSize: "14px", fontWeight: 600, color: "#0F172A" }}>{bar.s} ★</div>
                    <div style={{ flex: 1, height: 8, background: "#F1F5F9", borderRadius: 9999, overflow: "hidden" }}>
                      <div style={{ width: bar.p, height: "100%", background: "var(--primary)", borderRadius: 9999 }} />
                    </div>
                    <div style={{ width: 24, textAlign: "right", fontSize: "14px", color: "#64748B" }}>{bar.c}</div>
                    <div style={{ width: 40, textAlign: "right", fontSize: "13px", color: "#94A3B8" }}>{bar.p}</div>
                  </div>
                ))}
              </div>
            </div>

            {reviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}><MessageSquare size={32} color="var(--primary)" /></div>
                <h3 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A" }}>Aucun avis pour le moment</h3>
                <p style={{ color: "#64748B" }}>Les avis apparaîtront quand vos clients recevront leurs commandes.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {reviews.map((r: any) => (
                  <div key={r.id} className="card" style={{ background: "white", borderRadius: "20px", padding: "1.5rem", display: "flex", gap: "1.25rem", boxShadow: "var(--shadow-card)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, flexShrink: 0, position: "relative" }}>
                      {r.customer.name?.[0]}
                      <div style={{ position: "absolute", bottom: -4, right: -4, background: "white", borderRadius: "50%", padding: 2 }}>
                        <CheckCircle size={16} color="var(--teal)" fill="var(--teal)" style={{ color: "white" }} />
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <span style={{ fontWeight: 700, fontSize: "15px", color: "#0F172A", marginRight: 8 }}>{r.customer.name}</span>
                          <span style={{ fontSize: "13px", color: "#94A3B8" }}>il y a 3 jours</span>
                          <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--primary)", marginTop: 2 }}>Plat commandé</div>
                        </div>
                        <div style={{ display: "flex", gap: 2 }}>{[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= r.rating ? "var(--primary)" : "none"} color="var(--primary)" />)}</div>
                      </div>
                      <p style={{ fontSize: "15px", color: "#475569", lineHeight: 1.7, marginTop: "12px", marginBottom: "16px" }}>{r.comment || "Aucun commentaire."}</p>
                      <button className="btn btn-ghost" style={{ height: 36, padding: "0 16px", background: "#F8FAFC", color: "#475569", fontSize: "13px", borderRadius: "8px" }}>Répondre à cet avis</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: STATS (Mocked charts) ── */}
        {activeTab === "stats" && (
          <div>
            <div className="cook-public-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
              {[
                { label: "Vues du profil", v: "1 247", t: "+12% cette semaine" },
                { label: "Commandes reçues", v: "12", t: "+3 vs mois dernier" },
                { label: "Revenus totaux", v: "45 600 DA", t: "+8%" },
                { label: "Note moyenne", v: "4.8", t: "Basé sur 24 avis" },
              ].map(s => (
                <div key={s.label} className="card" style={{ background: "white", borderRadius: "20px", padding: "1.5rem", boxShadow: "var(--shadow-card)" }}>
                  <div style={{ fontSize: "14px", color: "#64748B", marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>{s.v}</div>
                  <div style={{ fontSize: "13px", color: "var(--success)", fontWeight: 600 }}>{s.t}</div>
                </div>
              ))}
            </div>

            <div className="cook-public-charts-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
              <div className="card" style={{ background: "white", borderRadius: "20px", padding: "1.5rem", boxShadow: "var(--shadow-card)", height: 320 }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "1rem" }}>Vues du profil (30 derniers jours)</h3>
                <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "flex-end", gap: "12px", paddingBottom: 40, borderBottom: "1px solid #E2E8F0" }}>
                  {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                    <div key={i} style={{ flex: 1, background: "var(--primary-subtle)", borderRadius: "4px 4px 0 0", height: `${h}%`, position: "relative" }}>
                      <div style={{ position: "absolute", top: -6, left: 0, right: 0, height: 4, background: "var(--primary)", borderRadius: 2 }} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="card" style={{ background: "white", borderRadius: "20px", padding: "1.5rem", boxShadow: "var(--shadow-card)", height: 320 }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "1rem" }}>Revenus par plat</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
                  {[ { n: "Couscous Royal", w: "80%" }, { n: "Tajine Poulet", w: "45%" }, { n: "Chorba", w: "30%" }].map(d => (
                    <div key={d.n}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: 4 }}>
                        <span style={{ fontWeight: 600 }}>{d.n}</span>
                      </div>
                      <div style={{ height: 8, background: "#F1F5F9", borderRadius: 4, overflow: "hidden" }}>
                        <div style={{ width: d.w, height: "100%", background: "linear-gradient(90deg, #F97316, #FBBF24)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: "#FFF7ED", border: "1px solid #FDE68A", borderRadius: "20px", padding: "1.5rem", marginTop: "1.5rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <TrendingUp size={24} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ fontSize: "16px", fontWeight: 700, color: "#633806", margin: "0 0 4px" }}>Conseil pour améliorer vos ventes</h4>
                <p style={{ fontSize: "15px", color: "#633806", margin: 0 }}>Vos plats de couscous sont vos meilleurs vendeurs. Ajoutez plus de variétés de couscous pour augmenter vos revenus.</p>
                <Link href="#" style={{ fontSize: "14px", fontWeight: 700, color: "var(--primary)", marginTop: 8, display: "inline-block" }}>En savoir plus →</Link>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: PARAMÈTRES ── */}
        {activeTab === "settings" && (
          <div style={{ maxWidth: 800 }}>
            <div className="card" style={{ background: "white", borderRadius: "20px", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "var(--shadow-card)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "1.5rem", color: "#0F172A" }}>Visibilité du profil</h3>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#0F172A" }}>Profil public</div>
                  <div style={{ fontSize: "13px", color: "#94A3B8" }}>Votre profil est visible par tous les clients</div>
                </div>
                <div style={{ width: 48, height: 24, borderRadius: 12, background: "var(--primary)", position: "relative" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: "white", position: "absolute", top: 2, right: 2 }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#0F172A" }}>Recevoir des commandes</div>
                  <div style={{ fontSize: "13px", color: "#94A3B8" }}>Mettez votre profil en pause si vous êtes indisponible</div>
                </div>
                <div style={{ width: 48, height: 24, borderRadius: 12, background: "var(--primary)", position: "relative" }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, background: "white", position: "absolute", top: 2, right: 2 }} />
                </div>
              </div>
            </div>

            <div className="card" style={{ background: "white", borderRadius: "20px", padding: "1.5rem", marginBottom: "1.5rem", boxShadow: "var(--shadow-card)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "1.5rem", color: "#0F172A" }}>Lien public</h3>
              <div style={{ background: "#F8FAFC", borderRadius: "12px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "#0F172A" }}>darnafood.dz/cooks/{user.id}</span>
                <button onClick={handleCopyLink} className="btn" style={{ height: 36, padding: "0 16px", borderRadius: "8px", border: "1px solid var(--primary)", color: "var(--primary)", background: "white", fontSize: "14px", fontWeight: 600 }}>Copier</button>
              </div>
            </div>
            
            <div className="card" style={{ background: "white", borderRadius: "20px", padding: "1.5rem", boxShadow: "var(--shadow-card)" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "1.5rem", color: "#0F172A" }}>Référencement SEO</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: 6 }}>Titre de la page</label>
                  <input type="text" defaultValue={`${user.name} — Cuisinier à ${profile.wilaya} | DarnaFood`} style={{ width: "100%", height: 44, borderRadius: "12px", border: "1px solid var(--border)", padding: "0 12px" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: 6 }}>Description</label>
                  <textarea defaultValue={`Découvrez les plats faits maison de ${user.name}...`} style={{ width: "100%", height: 80, borderRadius: "12px", border: "1px solid var(--border)", padding: "12px" }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .cook-public-profile-row { flex-direction: column !important; align-items: center !important; gap: 1.25rem !important; padding: 0 1.25rem 1.5rem !important; text-align: center !important; }
          .cook-public-profile-row > div[style*="flex: 1"] { padding-bottom: 0 !important; }
          .cook-public-actions { flex-direction: row !important; flex-wrap: wrap !important; justify-content: center !important; }
        }
        @media (max-width: 768px) {
          .cook-public-cover { height: 140px !important; }
          .cook-public-profile-row { margin-top: -3rem !important; }
          .cook-public-avatar { width: 96px !important; height: 96px !important; }
          .cook-public-avatar h1 { font-size: 24px !important; }
          .cook-public-stats-bar { grid-template-columns: repeat(2, 1fr) !important; padding: 1rem !important; gap: 0.5rem !important; }
          .cook-public-stats-bar > div:nth-child(1), .cook-public-stats-bar > div:nth-child(2) { border-bottom: 1px solid var(--border) !important; padding-bottom: 0.75rem !important; }
          .cook-public-stats-bar > div:nth-child(3), .cook-public-stats-bar > div:nth-child(4) { padding-top: 0.75rem !important; }
          .cook-public-stats-bar > div[style*="position: relative"] > div > div > div > span:first-child { font-size: 22px !important; }
          .cook-public-tabs-strip { overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; }
          .cook-public-tabs-strip > div { flex-wrap: nowrap !important; }
          .cook-public-tab-content-header { flex-direction: column !important; align-items: flex-start !important; gap: 0.75rem !important; }
          .cook-public-tab-content-header > div:last-child { width: 100% !important; }
          .cook-public-tab-content-header > div:last-child a, .cook-public-tab-content-header > div:last-child button { flex: 1 !important; }
          .cook-public-rating-distribution { flex-direction: column !important; gap: 1.5rem !important; padding: 1.25rem !important; }
          .cook-public-rating-distribution > div:first-child { min-width: 0 !important; }
          .cook-public-rating-big { font-size: 56px !important; }
          .cook-public-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.75rem !important; }
          .cook-public-stats-grid > div { padding: 1rem !important; }
          .cook-public-stats-grid > div > div:nth-child(2) { font-size: 22px !important; }
          .cook-public-charts-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .cook-public-stats-bar { padding: 0.75rem !important; }
          .cook-public-actions { width: 100% !important; }
          .cook-public-actions a, .cook-public-actions button { flex: 1 !important; min-width: 0 !important; padding: 0 8px !important; font-size: 12px !important; }
        }
      `}</style>
    </div>
  );
}
