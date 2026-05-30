"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { WILAYA_NAMES } from "@/lib/wilayas";
import { CreditCard, Banknote, Bike, Store, ArrowRight, ShieldCheck, AlertTriangle, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";

const DELIVERY_FEE = 200;

export default function CheckoutPage() {
  const router = useRouter();
  const { items, cookId, cookName, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  const [delivery, setDelivery] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [payment, setPayment] = useState<"cash" | "online">("cash");
  const [form, setForm] = useState({ wilaya: "Alger", quartier: "", address: "", phone: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = delivery === "DELIVERY" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (delivery === "DELIVERY") {
      if (!form.quartier.trim()) e.quartier = "Veuillez saisir votre quartier";
      if (!form.address.trim()) e.address = "Veuillez saisir votre adresse";
      if (!form.phone.trim()) e.phone = "Veuillez saisir votre numéro de téléphone";
      else if (!/^0?(5|6|7)\d{8}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "Numéro de téléphone invalide (ex: 07 XX XX XX XX)";
    }
    if (!cookId) e.cart = "Votre panier est vide";
    if (items.length === 0) e.cart = "Votre panier est vide";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    if (!cookId) { toast.error("Panier vide"); return; }

    setLoading(true);
    try {
      const addressStr = delivery === "DELIVERY"
        ? `${form.address}, ${form.quartier}, ${form.wilaya}`
        : undefined;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cookId,
          type: delivery,
          totalAmount: total,
          deliveryFee,
          deliveryAddress: addressStr,
          notes: form.note || undefined,
          items: items.map(i => ({
            dishId: i.dishId,
            quantity: i.quantity,
            priceAtOrder: i.price,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de la création de la commande");

      clearCart();
      router.push(`/orders/confirm?orderId=${data.orderId}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
        <div style={{ maxWidth: 600, margin: "0 auto", padding: "6rem 1.5rem", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#FAEEDA", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <ShoppingCart size={36} color="#F97316" />
          </div>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", marginBottom: "0.75rem" }}>Votre panier est vide</h2>
          <p style={{ fontSize: "15px", color: "#64748B", marginBottom: "1.5rem" }}>Ajoutez des plats avant de passer commande</p>
          <Link href="/dishes" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", height: 48, padding: "0 1.5rem", borderRadius: 12, background: "#F97316", color: "white", textDecoration: "none", fontSize: "15px", fontWeight: 600 }}>
            Voir les plats <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem, 4vw, 2rem)", fontWeight: 800, color: "#0F172A", marginBottom: "2rem" }}>
          Finaliser la commande
        </h1>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2rem", alignItems: "flex-start" }} className="checkout-grid">

          {/* ── Left: Form ── */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

            {/* Section 1: Mode de récupération */}
            <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "1.25rem" }}>Mode de récupération</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { value: "DELIVERY" as const, label: "Livraison", sub: "~45 min · Frais: 200 DA", icon: Bike },
                  { value: "PICKUP" as const, label: "Retrait", sub: "Chez le cuisinier · Gratuit", icon: Store },
                ].map(opt => (
                  <button key={opt.value} type="button" onClick={() => { setDelivery(opt.value); setErrors({}); }}
                    style={{ padding: "1rem", borderRadius: 14, border: `2px solid ${delivery === opt.value ? "#F97316" : "#E2E8F0"}`, background: delivery === opt.value ? "#FFF7ED" : "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.875rem", transition: "all 150ms", textAlign: "left" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: delivery === opt.value ? "#F97316" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <opt.icon size={20} color={delivery === opt.value ? "white" : "#64748B"} />
                    </div>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>{opt.label}</div>
                      <div style={{ fontSize: "13px", color: "#64748B" }}>{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 2: Address (only for delivery) */}
            {delivery === "DELIVERY" && (
              <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "1.25rem" }}>Adresse de livraison</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Ville (Wilaya) <span style={{ color: "#EF4444" }}>*</span></label>
                    <select value={form.wilaya} onChange={e => setForm(f => ({ ...f, wilaya: e.target.value }))}
                      style={{ width: "100%", height: 48, borderRadius: 12, border: "1.5px solid #E2E8F0", padding: "0 1rem", fontSize: "14px", color: "#0F172A", background: "white", outline: "none" }}>
                      {WILAYA_NAMES.map(w => <option key={w}>{w}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Quartier <span style={{ color: "#EF4444" }}>*</span></label>
                    <input type="text" value={form.quartier} onChange={e => { setForm(f => ({ ...f, quartier: e.target.value })); if (errors.quartier) setErrors(e => { delete e.quartier; return { ...e }; }); }}
                      placeholder="Ex: Bab El Oued, Kouba…"
                      style={{ width: "100%", height: 48, borderRadius: 12, border: `1.5px solid ${errors.quartier ? "#EF4444" : "#E2E8F0"}`, padding: "0 1rem", fontSize: "14px", color: "#0F172A", outline: "none" }} />
                    {errors.quartier && <p style={{ color: "#EF4444", fontSize: "12px", marginTop: 4 }}>{errors.quartier}</p>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Adresse exacte <span style={{ color: "#EF4444" }}>*</span></label>
                    <textarea value={form.address} onChange={e => { setForm(f => ({ ...f, address: e.target.value })); if (errors.address) setErrors(e => { delete e.address; return { ...e }; }); }}
                      placeholder="N° rue, bâtiment, étage, code porte…" rows={3}
                      style={{ width: "100%", borderRadius: 12, border: `1.5px solid ${errors.address ? "#EF4444" : "#E2E8F0"}`, padding: "0.875rem 1rem", fontSize: "14px", color: "#0F172A", outline: "none", resize: "vertical" }} />
                    {errors.address && <p style={{ color: "#EF4444", fontSize: "12px", marginTop: 4 }}>{errors.address}</p>}
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#475569", marginBottom: "0.5rem" }}>Téléphone <span style={{ color: "#EF4444" }}>*</span></label>
                    <div style={{ display: "flex", alignItems: "center", border: `1.5px solid ${errors.phone ? "#EF4444" : "#E2E8F0"}`, borderRadius: 12, overflow: "hidden", height: 48 }}>
                      <span style={{ padding: "0 0.875rem", fontSize: "14px", fontWeight: 600, color: "#0F172A", borderRight: `1.5px solid ${errors.phone ? "#EF4444" : "#E2E8F0"}`, height: "100%", display: "flex", alignItems: "center", background: "#F8FAFC" }}>+213</span>
                      <input type="tel" value={form.phone} onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); if (errors.phone) setErrors(e => { delete e.phone; return { ...e }; }); }}
                        placeholder="07 XX XX XX XX"
                        style={{ flex: 1, height: "100%", padding: "0 1rem", fontSize: "14px", color: "#0F172A", border: "none", outline: "none" }} />
                    </div>
                    {errors.phone && <p style={{ color: "#EF4444", fontSize: "12px", marginTop: 4 }}>{errors.phone}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Section 3: Payment */}
            <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "1.25rem" }}>Mode de paiement</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {[
                  { value: "online" as const, label: "En ligne", sub: "CIB, Dahabia", icon: CreditCard },
                  { value: "cash" as const, label: "Cash à la livraison", sub: "Paiement à la réception", icon: Banknote },
                ].map(opt => (
                  <button key={opt.value} type="button" onClick={() => setPayment(opt.value)}
                    style={{ padding: "1rem", borderRadius: 14, border: `2px solid ${payment === opt.value ? "#F97316" : "#E2E8F0"}`, background: payment === opt.value ? "#FFF7ED" : "white", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.875rem", textAlign: "left", transition: "all 150ms" }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: payment === opt.value ? "#F97316" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <opt.icon size={20} color={payment === opt.value ? "white" : "#64748B"} />
                    </div>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>{opt.label}</div>
                      <div style={{ fontSize: "13px", color: "#64748B" }}>{opt.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 4: Note */}
            <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "0.75rem" }}>Note pour le cuisinier</h2>
              <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "1rem" }}>Allergies, préférences, heure de livraison…</p>
              <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))} placeholder="Ex: Sans piment, livrer après 18h…" rows={3}
                style={{ width: "100%", borderRadius: 12, border: "1.5px solid #E2E8F0", padding: "0.875rem 1rem", fontSize: "14px", color: "#0F172A", outline: "none", resize: "vertical" }} />
            </div>

            {errors.cart && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.875rem 1rem", borderRadius: 12, background: "#FEF2F2", color: "#EF4444", fontSize: "14px", fontWeight: 500 }}>
                <AlertTriangle size={16} /> {errors.cart}
              </div>
            )}

            <button type="submit" disabled={loading}
              style={{ height: 56, borderRadius: 14, background: loading ? "#FBBF24" : "#F97316", color: "white", border: "none", fontSize: "16px", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", transition: "background 150ms" }}>
              {loading ? "Confirmation en cours…" : (<>Confirmer la commande <ArrowRight size={18} /></>)}
            </button>
          </form>

          {/* ── Right: Summary ── */}
          <div style={{ position: "sticky", top: "calc(72px + 1.5rem)" }}>
            <div style={{ background: "white", borderRadius: 20, padding: "1.75rem", boxShadow: "0 4px 20px rgba(0,0,0,0.08)", border: "1px solid #F1F5F9" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", marginBottom: "1.5rem" }}>Récapitulatif</h2>

              {cookName && (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid #F1F5F9" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#F97316", color: "white", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {cookName[0]}
                  </div>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A" }}>{cookName}</span>
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
                {items.map(item => (
                  <div key={item.dishId} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                    <span style={{ color: "#64748B" }}>{item.name} × {item.quantity}</span>
                    <span style={{ fontWeight: 600 }}>{(item.price * item.quantity).toLocaleString("fr-DZ")} DA</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                  <span style={{ color: "#64748B" }}>Livraison</span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>{deliveryFee.toLocaleString("fr-DZ")} DA</span>
                </div>
              </div>

              <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>Total</span>
                  <span style={{ fontSize: "24px", fontWeight: 800, color: "#F97316" }}>{total.toLocaleString("fr-DZ")} DA</span>
                </div>
              </div>

              <p style={{ marginTop: "1.25rem", textAlign: "center", fontSize: "13px", color: "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.375rem" }}>
                <ShieldCheck size={14} color="#0D9488" /> Paiement sécurisé · Remboursement garanti
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .checkout-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}