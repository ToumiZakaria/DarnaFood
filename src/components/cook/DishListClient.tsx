"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Eye, EyeOff, UtensilsCrossed } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function DishListClient({ initialDishes }: { initialDishes: any[] }) {
  const [dishes, setDishes] = useState(initialDishes);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const toggleAvailability = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/dishes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !current }),
      });
      if (!res.ok) throw new Error();
      setDishes((prev) => prev.map((d) => (d.id === id ? { ...d, isAvailable: !current } : d)));
      toast.success(current ? "Plat masqué" : "Plat disponible !");
      router.refresh();
    } catch {
      toast.error("Impossible de modifier le statut");
    }
  };

  const deleteDish = async (id: string) => {
    if (!confirm("Supprimer ce plat définitivement ?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/dishes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setDishes((prev) => prev.filter((d) => d.id !== id));
      toast.success("Plat supprimé");
      router.refresh();
    } catch {
      toast.error("Impossible de supprimer le plat");
    } finally {
      setDeletingId(null);
    }
  };

  const activeCount = dishes.filter(d => d.isAvailable).length;
  const hiddenCount = dishes.length - activeCount;

  return (
    <div>
      {/* ── Page Header ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 800, color: "#0F172A", marginBottom: "4px" }}>
            Mes plats
          </h1>
          <p style={{ color: "#64748B", fontSize: "15px", fontWeight: 400 }}>
            Gérez votre menu et vos disponibilités
          </p>
        </div>
        <Link
          href="/cook/dishes/new"
          style={{
            height: 44, padding: "0 20px", borderRadius: "12px", background: "var(--primary)", color: "white",
            fontSize: "14px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "8px", textDecoration: "none",
            transition: "filter 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(0.9)")}
          onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
        >
          <Plus size={18} /> Ajouter un plat
        </Link>
      </div>

      {/* ── Stats Mini Row ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "1.5rem" }}>
        <div className="card" style={{ padding: "16px", background: "white", borderRadius: "16px", textAlign: "center", fontWeight: 600, color: "var(--text-primary)" }}>
          {activeCount} plats actifs
        </div>
        <div className="card" style={{ padding: "16px", background: "white", borderRadius: "16px", textAlign: "center", fontWeight: 600, color: "var(--primary)" }}>
          0 en attente
        </div>
        <div className="card" style={{ padding: "16px", background: "white", borderRadius: "16px", textAlign: "center", fontWeight: 600, color: "var(--text-muted)" }}>
          {hiddenCount} masqués
        </div>
      </div>

      {/* ── Dishes Table ── */}
      {dishes.length === 0 ? (
        <div className="card" style={{ border: "2px dashed var(--border)", padding: "4rem 2rem", textAlign: "center", background: "white", borderRadius: "20px" }}>
          <div style={{ width: 64, height: 64, background: "#FFF7ED", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
            <UtensilsCrossed size={32} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>Aucun plat</h3>
          <p style={{ color: "#64748B", marginBottom: "1rem" }}>Commencez par ajouter votre premier plat !</p>
        </div>
      ) : (
        <div className="card" style={{ background: "white", borderRadius: "20px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead style={{ background: "#F8FAFC", fontSize: "13px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <tr>
                  <th style={{ padding: "16px 20px" }}>Photo</th>
                  <th style={{ padding: "16px 20px" }}>Nom</th>
                  <th style={{ padding: "16px 20px" }}>Catégorie</th>
                  <th style={{ padding: "16px 20px" }}>Prix</th>
                  <th style={{ padding: "16px 20px" }}>Stock</th>
                  <th style={{ padding: "16px 20px" }}>Statut</th>
                  <th style={{ padding: "16px 20px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish.id} className="hover-bg-gray" style={{ borderTop: "1px solid var(--border)", fontSize: "14px", color: "var(--text-primary)", transition: "background 0.2s" }}>
                    <td style={{ padding: "12px 20px" }}>
                      <div style={{ width: 64, height: 48, borderRadius: "8px", overflow: "hidden", background: "var(--bg-secondary)", position: "relative" }}>
                        {dish.images?.[0]?.url ? (
                          <Image src={dish.images[0].url} alt={dish.name} fill style={{ objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>🍽️</div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 20px", fontWeight: 600 }}>{dish.name}</td>
                    <td style={{ padding: "12px 20px", color: "var(--text-muted)" }}>{dish.category.name}</td>
                    <td style={{ padding: "12px 20px", fontWeight: 700, color: "var(--primary)" }}>{dish.price.toLocaleString("fr-DZ")} DA</td>
                    <td style={{ padding: "12px 20px", color: "var(--text-muted)" }}>Illimité</td>
                    <td style={{ padding: "12px 20px" }}>
                      <button
                        onClick={() => toggleAvailability(dish.id, dish.isAvailable)}
                        style={{
                          background: dish.isAvailable ? "#F0FDF4" : "#FEF2F2",
                          color: dish.isAvailable ? "#15803D" : "#EF4444",
                          padding: "4px 10px", borderRadius: "9999px", fontSize: "12px", fontWeight: 600,
                          border: "none", cursor: "pointer"
                        }}
                      >
                        {dish.isAvailable ? "Disponible" : "Masqué"}
                      </button>
                    </td>
                    <td style={{ padding: "12px 20px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                        <Link href={`/cook/dishes/${dish.id}/edit`} className="action-icon hover-amber">
                          <Edit size={16} />
                        </Link>
                        <button onClick={() => deleteDish(dish.id)} disabled={deletingId === dish.id} className="action-icon hover-red">
                          <Trash2 size={16} />
                        </button>
                        <Link href={`/dishes/${dish.id}`} className="action-icon hover-gray">
                          <Eye size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-bg-gray:hover { background: #F8FAFC !important; }
        .action-icon {
          width: 32px; height: 32px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: none; cursor: pointer;
          color: #94A3B8; transition: all 0.2s; text-decoration: none;
        }
        .hover-amber:hover { background: #FFF7ED; color: #F97316; }
        .hover-red:hover { background: #FEF2F2; color: #EF4444; }
        .hover-gray:hover { background: #F1F5F9; color: #475569; }
      `}</style>
    </div>
  );
}
