"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Trash2, Eye, EyeOff, UtensilsCrossed } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#0F172A", marginBottom: 4 }}>
            Mes plats
          </h1>
          <p style={{ color: "#64748B", fontSize: "13px" }}>Gérez votre menu et vos disponibilités</p>
        </div>
        <Link
          href="/cook/dishes/new"
          style={{ height: 40, padding: "0 16px", borderRadius: 10, background: "var(--primary)", color: "white", fontSize: "13px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "6px", textDecoration: "none", flexShrink: 0 }}
        >
          <Plus size={16} /> Ajouter
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "1.25rem" }}>
        <div style={{ padding: "12px", background: "white", borderRadius: 14, textAlign: "center", fontWeight: 600, color: "#0F172A", fontSize: "13px" }}>
          {activeCount} actifs
        </div>
        <div style={{ padding: "12px", background: "white", borderRadius: 14, textAlign: "center", fontWeight: 600, color: "#F97316", fontSize: "13px" }}>
          0 en attente
        </div>
        <div style={{ padding: "12px", background: "white", borderRadius: 14, textAlign: "center", fontWeight: 600, color: "#64748B", fontSize: "13px" }}>
          {hiddenCount} masqués
        </div>
      </div>

      {dishes.length === 0 ? (
        <div style={{ border: "2px dashed var(--border)", padding: "3rem 1.5rem", textAlign: "center", background: "white", borderRadius: 18 }}>
          <div style={{ width: 56, height: 56, background: "#FFF7ED", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.875rem" }}>
            <UtensilsCrossed size={28} color="var(--primary)" />
          </div>
          <h3 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>Aucun plat</h3>
          <p style={{ color: "#64748B", fontSize: "13px", marginBottom: "0.875rem" }}>Commencez par ajouter votre premier plat !</p>
          <Link href="/cook/dishes/new" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", height: 38, padding: "0 1rem", borderRadius: 10, background: "var(--primary)", color: "white", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>
            <Plus size={14} /> Ajouter
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="cook-dishes-table" style={{ background: "white", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead style={{ background: "#F8FAFC", fontSize: "11px", fontWeight: 600, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <tr>
                    <th style={{ padding: "12px 16px" }}>Photo</th>
                    <th style={{ padding: "12px 16px" }}>Nom</th>
                    <th style={{ padding: "12px 16px" }}>Catégorie</th>
                    <th style={{ padding: "12px 16px" }}>Prix</th>
                    <th style={{ padding: "12px 16px" }}>Statut</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dishes.map((dish) => (
                    <tr key={dish.id} style={{ borderTop: "1px solid #F1F5F9", fontSize: "13px" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ width: 56, height: 42, borderRadius: 8, overflow: "hidden", background: "#F1F5F9", position: "relative" }}>
                          {dish.images?.[0]?.url ? <Image src={dish.images[0].url} alt={dish.name} fill style={{ objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🍽️</div>}
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 600 }}>{dish.name}</td>
                      <td style={{ padding: "12px 16px", color: "#64748B" }}>{dish.category.name}</td>
                      <td style={{ padding: "12px 16px", fontWeight: 700, color: "var(--primary)" }}>{dish.price.toLocaleString("fr-DZ")} DA</td>
                      <td style={{ padding: "12px 16px" }}>
                        <button onClick={() => toggleAvailability(dish.id, dish.isAvailable)} style={{ background: dish.isAvailable ? "#F0FDF4" : "#FEF2F2", color: dish.isAvailable ? "#15803D" : "#EF4444", padding: "3px 8px", borderRadius: 9999, fontSize: "11px", fontWeight: 600, border: "none", cursor: "pointer" }}>
                          {dish.isAvailable ? "Disponible" : "Masqué"}
                        </button>
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                          <Link href={`/cook/dishes/${dish.id}/edit`} className="action-icon hover-amber"><Edit size={14} /></Link>
                          <button onClick={() => deleteDish(dish.id)} disabled={deletingId === dish.id} className="action-icon hover-red"><Trash2 size={14} /></button>
                          <Link href={`/dishes/${dish.id}`} className="action-icon hover-gray"><Eye size={14} /></Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="cook-dishes-cards" style={{ display: "none", flexDirection: "column", gap: "0.625rem" }}>
            {dishes.map((dish) => (
              <div key={dish.id} style={{ background: "white", borderRadius: 14, padding: "0.75rem", display: "flex", gap: "0.75rem" }}>
                <div style={{ width: 60, height: 60, borderRadius: 10, overflow: "hidden", background: "#F1F5F9", position: "relative", flexShrink: 0 }}>
                  {dish.images?.[0]?.url ? <Image src={dish.images[0].url} alt={dish.name} fill style={{ objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>🍽️</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dish.name}</div>
                  <div style={{ fontSize: "11px", color: "#94A3B8" }}>{dish.category.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 2, gap: "0.5rem" }}>
                    <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--primary)" }}>{dish.price.toLocaleString("fr-DZ")} DA</span>
                    <button onClick={() => toggleAvailability(dish.id, dish.isAvailable)} style={{ background: dish.isAvailable ? "#F0FDF4" : "#FEF2F2", color: dish.isAvailable ? "#15803D" : "#EF4444", padding: "2px 8px", borderRadius: 9999, fontSize: "10px", fontWeight: 600, border: "none", cursor: "pointer" }}>
                      {dish.isAvailable ? "Dispo" : "Masqué"}
                    </button>
                  </div>
                  <div style={{ display: "flex", gap: "0.375rem", marginTop: 4 }}>
                    <Link href={`/cook/dishes/${dish.id}/edit`} style={{ flex: 1, height: 28, borderRadius: 7, background: "#FFF7ED", color: "#F97316", fontSize: "11px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}><Edit size={11} /> Éditer</Link>
                    <Link href={`/dishes/${dish.id}`} style={{ flex: 1, height: 28, borderRadius: 7, background: "#F1F5F9", color: "#475569", fontSize: "11px", fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}><Eye size={11} /> Voir</Link>
                    <button onClick={() => deleteDish(dish.id)} disabled={deletingId === dish.id} style={{ width: 28, height: 28, borderRadius: 7, background: "#FEF2F2", color: "#EF4444", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={11} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <style jsx>{`
        .action-icon {
          width: 28px; height: 28px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: none; cursor: pointer;
          color: #94A3B8; transition: all 0.2s; text-decoration: none;
        }
        .hover-amber:hover { background: #FFF7ED; color: #F97316; }
        .hover-red:hover { background: #FEF2F2; color: #EF4444; }
        .hover-gray:hover { background: #F1F5F9; color: #475569; }
        @media (max-width: 768px) {
          .cook-dishes-table { display: none !important; }
          .cook-dishes-cards { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
