"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ImagePlus, X, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
}

interface DishFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any;
  categories: Category[];
}

export default function DishForm({ initialData, categories }: DishFormProps) {
  const router = useRouter();
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name:        initialData?.name        || "",
    categoryId:  initialData?.categoryId  || "",
    description: initialData?.description || "",
    price:       initialData?.price?.toString()    || "",
    prepTime:    initialData?.prepTime?.toString() || "30",
    isAvailable: initialData?.isAvailable ?? true,
    // UI Only fields for the spec
    quantity:    "illimité",
    deliveryMode: ["domicile", "retrait"],
    deliveryFee: "300",
  });

  const [existingImages, setExistingImages] = useState<{ id: string; url: string }[]>(
    initialData?.images || []
  );
  const [newImages, setNewImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalImages = existingImages.length + newImages.length;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (totalImages + files.length > 5) {
      toast.error("Maximum 5 photos autorisées.");
      return;
    }
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setNewImages((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent, addAnother = false) => {
    e.preventDefault();
    if (totalImages === 0) {
      toast.error("Veuillez ajouter au moins une photo du plat.");
      return;
    }
    setIsSubmitting(true);
    try {
      const url    = isEditing ? `/api/dishes/${initialData.id}` : "/api/dishes";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price:    parseFloat(formData.price),
          prepTime: parseInt(formData.prepTime),
          existingImages: existingImages.map((i) => i.id),
          newImages,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Une erreur est survenue");
      }
      toast.success(isEditing ? "Plat modifié !" : "Plat créé avec succès !");
      router.refresh();
      
      if (addAnother && !isEditing) {
        setFormData({ ...formData, name: "", description: "", price: "" });
        setNewImages([]);
        window.scrollTo(0, 0);
      } else {
        router.push("/cook/dishes");
      }
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, false)} style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "100px" }}>
      
      {/* ── Section 1: Photos du plat ── */}
      <div className="card" style={{ padding: "24px", background: "white", borderRadius: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>Photos du plat</h3>
        
        {totalImages < 5 && (
          <label style={{
            height: "200px", borderRadius: "16px", border: "2px dashed #CBD5E1",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s", background: "#F8FAFC", marginBottom: "16px"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "var(--primary-light)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#CBD5E1"; e.currentTarget.style.background = "#F8FAFC"; }}
          >
            <div style={{ width: 48, height: 48, background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <ImagePlus size={24} color="#94A3B8" />
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>Glissez vos photos ici</div>
            <div style={{ fontSize: "14px", color: "#94A3B8" }}>ou cliquez pour parcourir</div>
            <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: "4px" }}>JPG, PNG, WebP — max 5 photos</div>
            <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleImageUpload} />
          </label>
        )}

        {(existingImages.length > 0 || newImages.length > 0) && (
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {[...existingImages.map(i => ({ id: i.id, url: i.url, isNew: false })), ...newImages.map((u, i) => ({ id: i.toString(), url: u, isNew: true }))].map((img, idx) => (
              <div key={idx} style={{ position: "relative", width: 80, height: 80, borderRadius: "8px", overflow: "hidden", border: idx === 0 ? "2px solid var(--primary)" : "none" }}>
                <Image src={img.url} alt="Plat" fill style={{ objectFit: "cover" }} />
                {idx === 0 && (
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "var(--primary)", color: "white", fontSize: "10px", fontWeight: 700, textAlign: "center", padding: "2px 0" }}>
                    PRINCIPAL
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => img.isNew ? setNewImages(prev => prev.filter((_, i) => i.toString() !== img.id)) : setExistingImages(prev => prev.filter(i => i.id !== img.id))}
                  style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,0.5)", color: "white", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 2: Informations ── */}
      <div className="card" style={{ padding: "24px", background: "white", borderRadius: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>Informations</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--slate-light)", marginBottom: "8px" }}>Nom du plat</label>
            <input
              type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Couscous Royal"
              style={{ width: "100%", height: 48, borderRadius: "12px", border: "1px solid var(--border)", padding: "0 16px", fontSize: "14px", outline: "none", transition: "border 0.2s" }}
              onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--slate-light)", marginBottom: "8px" }}>Catégorie</label>
            <select
              required value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              style={{ width: "100%", height: 48, borderRadius: "12px", border: "1px solid var(--border)", padding: "0 16px", fontSize: "14px", outline: "none", background: "white" }}
            >
              <option value="" disabled>Sélectionner une catégorie</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 600, color: "var(--slate-light)" }}>Description</label>
              <span style={{ fontSize: "12px", color: "#94A3B8" }}>{formData.description.length}/500</span>
            </div>
            <textarea
              required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value.slice(0, 500) })}
              placeholder="Ingrédients, histoire, particularités..."
              rows={4}
              style={{ width: "100%", borderRadius: "12px", border: "1px solid var(--border)", padding: "12px 16px", fontSize: "14px", outline: "none", resize: "vertical" }}
              onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--slate-light)", marginBottom: "8px" }}>Tags (Spécialités)</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Fait maison", "Traditionnel", "Épicé", "Végétarien"].map(tag => (
                <div key={tag} style={{ padding: "6px 12px", borderRadius: "9999px", border: "1px solid var(--border)", fontSize: "13px", color: "var(--text-secondary)", background: "#F8FAFC", cursor: "pointer" }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 3: Prix et disponibilité ── */}
      <div className="card" style={{ padding: "24px", background: "white", borderRadius: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>Prix et disponibilité</h3>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--slate-light)", marginBottom: "8px" }}>Prix</label>
            <div style={{ position: "relative" }}>
              <input
                type="number" required min="0" step="50" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                style={{ width: "100%", height: 48, borderRadius: "12px", border: "1px solid var(--border)", padding: "0 40px 0 16px", fontSize: "14px", outline: "none" }}
              />
              <span style={{ position: "absolute", right: "16px", top: "14px", fontSize: "14px", color: "#94A3B8", fontWeight: 600 }}>DA</span>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--slate-light)", marginBottom: "8px" }}>Quantité disponible</label>
            <input
              type="text" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              style={{ width: "100%", height: 48, borderRadius: "12px", border: "1px solid var(--border)", padding: "0 16px", fontSize: "14px", outline: "none" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--slate-light)", marginBottom: "8px" }}>Temps de préparation</label>
            <select
              value={formData.prepTime} onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
              style={{ width: "100%", height: 48, borderRadius: "12px", border: "1px solid var(--border)", padding: "0 16px", fontSize: "14px", outline: "none", background: "white" }}
            >
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">1h</option>
              <option value="120">2h</option>
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--slate-light)", marginBottom: "8px" }}>Disponibilité</label>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 48, padding: "0 16px", border: "1px solid var(--border)", borderRadius: "12px", background: "#F8FAFC" }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>Disponible aujourd'hui</span>
              <label style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} checked={formData.isAvailable} onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })} />
                <div style={{ width: 44, height: 24, borderRadius: 9999, background: formData.isAvailable ? "var(--primary)" : "#CBD5E1", position: "relative", transition: "background 0.2s ease" }}>
                  <div style={{ position: "absolute", top: 2, left: formData.isAvailable ? 22 : 2, width: 20, height: 20, borderRadius: "50%", background: "white", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", transition: "left 0.2s ease" }} />
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section 4: Livraison ── */}
      <div className="card" style={{ padding: "24px", background: "white", borderRadius: "20px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>Livraison</h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--slate-light)", marginBottom: "12px" }}>Mode de récupération</label>
            <div style={{ display: "flex", gap: "16px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                <input type="checkbox" checked={formData.deliveryMode.includes("domicile")} onChange={() => {}} style={{ width: 18, height: 18, accentColor: "var(--primary)" }} /> Livraison à domicile
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontSize: "14px" }}>
                <input type="checkbox" checked={formData.deliveryMode.includes("retrait")} onChange={() => {}} style={{ width: 18, height: 18, accentColor: "var(--primary)" }} /> Retrait sur place
              </label>
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 600, color: "var(--slate-light)", marginBottom: "8px" }}>Frais de livraison estimés</label>
            <div style={{ position: "relative", maxWidth: "300px" }}>
              <input
                type="text" value={formData.deliveryFee} onChange={(e) => setFormData({ ...formData, deliveryFee: e.target.value })}
                style={{ width: "100%", height: 48, borderRadius: "12px", border: "1px solid var(--border)", padding: "0 40px 0 16px", fontSize: "14px", outline: "none" }}
              />
              <span style={{ position: "absolute", right: "16px", top: "14px", fontSize: "14px", color: "#94A3B8", fontWeight: 600 }}>DA</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", color: "#64748B", fontSize: "12px" }}>
              <Info size={14} /> Ces frais sont indicatifs, calculés par kilomètre en réalité.
            </div>
          </div>
        </div>
      </div>

      {/* ── Sticky Footer Bar ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 280, right: 0, height: 80,
        background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border)", display: "flex", alignItems: "center",
        justifyContent: "flex-end", padding: "0 32px", gap: "16px", zIndex: 30
      }}>
        <Link
          href="/cook/dishes"
          style={{ height: 48, padding: "0 24px", borderRadius: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 600, color: "var(--text-secondary)", textDecoration: "none" }}
        >
          Annuler
        </Link>
        {!isEditing && (
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting}
            style={{ height: 48, padding: "0 24px", borderRadius: "12px", border: "1px solid var(--primary)", background: "transparent", color: "var(--primary)", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}
          >
            Enregistrer et ajouter un autre
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ height: 48, padding: "0 32px", borderRadius: "12px", background: "var(--primary)", color: "white", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer", transition: "filter 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.filter = "brightness(0.9)"}
          onMouseLeave={(e) => e.currentTarget.style.filter = "brightness(1)"}
        >
          {isSubmitting ? "En cours..." : "Enregistrer le plat"}
        </button>
      </div>
    </form>
  );
}
