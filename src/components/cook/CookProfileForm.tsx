"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Camera, User, Star, MapPin, Save, RotateCcw } from "lucide-react";
import { WILAYAS } from "@/lib/wilayas";
import Link from "next/link";

interface CookProfileFormProps {
  user: {
    id: string;
    name: string | null;
    image: string | null;
    phone?: string | null;
  };
  profile: {
    bio: string | null;
    wilaya: string;
    commune: string;
    address: string;
  } | null;
}

export default function CookProfileForm({ user, profile }: CookProfileFormProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name:    user.name    || "",
    bio:     profile?.bio || "",
    wilaya:  profile?.wilaya  || "16",
    commune: profile?.commune || "",
    address: profile?.address || "",
    phone:   user.phone || "",
    cuisineType: "Traditionnelle algérienne",
    experience: "5-10 ans",
    specialties: ["Couscous", "Tajine", "Pâtisserie"],
    certifications: { hygiene: true, training: false },
    schedule: {
      lun: { open: true, start: "09:00", end: "18:00" },
      mar: { open: true, start: "09:00", end: "18:00" },
      mer: { open: true, start: "09:00", end: "18:00" },
      jeu: { open: true, start: "09:00", end: "18:00" },
      ven: { open: false, start: "09:00", end: "18:00" },
      sam: { open: true, start: "09:00", end: "18:00" },
      dim: { open: true, start: "09:00", end: "18:00" },
    },
    notifications: { email: true, sms: true, reviews: true, promos: false }
  });

  const [avatarSrc, setAvatarSrc] = useState<string | null>(user.image);
  const [newAvatarBase64, setNewAvatarBase64] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewAvatarBase64(reader.result as string);
      setAvatarSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/cook/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          bio: formData.bio,
          wilaya: formData.wilaya,
          commune: formData.commune,
          address: formData.address,
          newAvatarBase64,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de mise à jour");
      }
      toast.success("Profil mis à jour !");
      setNewAvatarBase64(null);
      router.refresh();
    } catch (error: unknown) {
      toast.error((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", paddingBottom: "100px", flexWrap: "wrap" }} className="cook-profile-layout">

      {/* ── Left Column: Form ── */}
      <form id="cook-profile-form" onSubmit={handleSubmit} style={{ flex: "1 1 480px", display: "flex", flexDirection: "column", gap: "1rem", minWidth: 0 }}>

        {/* Profile Header Card */}
        <div style={{ padding: "1.25rem", background: "white", borderRadius: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                {avatarSrc ? <Image src={avatarSrc} alt="Avatar" fill style={{ objectFit: "cover" }} /> : <User size={32} color="white" />}
              </div>
              <label style={{ position: "absolute", bottom: 0, right: 0, width: 30, height: 30, borderRadius: "50%", background: "white", border: "2px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--primary)" }}>
                <Camera size={13} />
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
              </label>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>Photo de profil</h3>
              <p style={{ fontSize: "12px", color: "#64748B", marginBottom: 2 }}>Cliquez sur l'icône caméra pour changer votre photo.</p>
              <p style={{ fontSize: "11px", color: "#94A3B8" }}>JPG, PNG, WebP. Max 2 Mo.</p>
            </div>
          </div>
        </div>

        {/* Informations du compte */}
        <div style={{ padding: "1.25rem", background: "white", borderRadius: 18 }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.875rem" }}>Informations du compte</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--slate-light)", marginBottom: 6 }}>Nom / Nom du restaurant</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--border)", padding: "0 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--slate-light)", marginBottom: 6 }}>Bio — Présentez votre cuisine</label>
              <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Parlez de votre expérience, vos spécialités..." rows={4} style={{ width: "100%", borderRadius: 10, border: "1px solid var(--border)", padding: "10px 12px", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--slate-light)", marginBottom: 6 }}>Spécialités</label>
              <div style={{ display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                {["Couscous", "Tajine", "Pâtisserie", "Soupe", "Plats en sauce"].map(spec => (
                  <div key={spec} style={{ padding: "0.3rem 0.75rem", borderRadius: 9999, border: formData.specialties.includes(spec) ? "1px solid var(--primary)" : "1px solid var(--border)", background: formData.specialties.includes(spec) ? "var(--primary-light)" : "white", color: formData.specialties.includes(spec) ? "var(--primary)" : "var(--text-secondary)", fontSize: "12px", fontWeight: 500, cursor: "pointer" }} onClick={() => setFormData(prev => ({ ...prev, specialties: prev.specialties.includes(spec) ? prev.specialties.filter(s => s !== spec) : [...prev.specialties, spec] }))}>
                    {spec}
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="form-grid-2">
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--slate-light)", marginBottom: 6 }}>Wilaya</label>
                <select value={formData.wilaya} onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })} style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--border)", padding: "0 12px", fontSize: "13px", outline: "none", background: "white" }}>
                  {WILAYAS.map((w: { code: string; name: string }) => <option key={w.code} value={w.code}>{w.code} — {w.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--slate-light)", marginBottom: 6 }}>Quartier</label>
                <input type="text" value={formData.commune} onChange={(e) => setFormData({ ...formData, commune: e.target.value })} style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--border)", padding: "0 12px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--slate-light)", marginBottom: 6 }}>Téléphone</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: "13px", color: "var(--text-primary)", fontWeight: 600 }}>+213</span>
                <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--border)", padding: "0 12px 0 56px", fontSize: "13px", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Informations professionnelles */}
        <div style={{ padding: "1.25rem", background: "white", borderRadius: 18 }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.875rem" }}>Informations professionnelles</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.875rem" }} className="form-grid-2">
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--slate-light)", marginBottom: 6 }}>Type de cuisine</label>
              <select value={formData.cuisineType} onChange={(e) => setFormData({ ...formData, cuisineType: e.target.value })} style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--border)", padding: "0 12px", fontSize: "13px", outline: "none", background: "white" }}>
                <option>Traditionnelle algérienne</option>
                <option>Kabyle</option>
                <option>Chaoui</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--slate-light)", marginBottom: 6 }}>Années d'expérience</label>
              <select value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} style={{ width: "100%", height: 42, borderRadius: 10, border: "1px solid var(--border)", padding: "0 12px", fontSize: "13px", outline: "none", background: "white" }}>
                <option>Moins d'1 an</option>
                <option>1-3 ans</option>
                <option>3-5 ans</option>
                <option>5-10 ans</option>
                <option>10+ ans</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "var(--slate-light)", marginBottom: 8 }}>Certifications</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer", fontSize: "13px", color: "var(--text-primary)" }}>
                <input type="checkbox" checked={formData.certifications.training} onChange={(e) => setFormData(prev => ({ ...prev, certifications: { ...prev.certifications, training: e.target.checked } }))} style={{ width: 16, height: 16, accentColor: "var(--primary)", flexShrink: 0 }} /> Formation en cuisine
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.625rem", cursor: "pointer", fontSize: "13px", color: "var(--text-primary)" }}>
                <input type="checkbox" checked={formData.certifications.hygiene} onChange={(e) => setFormData(prev => ({ ...prev, certifications: { ...prev.certifications, hygiene: e.target.checked } }))} style={{ width: 16, height: 16, accentColor: "var(--primary)", flexShrink: 0 }} /> Certificat d'hygiène
              </label>
            </div>
          </div>
        </div>

        {/* Horaires */}
        <div style={{ padding: "1.25rem", background: "white", borderRadius: 18 }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.875rem" }}>Horaires de travail</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {Object.entries(formData.schedule).map(([day, time]) => (
              <div key={day} className="cook-schedule-row" style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexWrap: "wrap" }}>
                <div style={{ width: 40, fontSize: "12px", fontWeight: 600, textTransform: "capitalize", color: "var(--text-primary)" }}>{day}</div>
                <label style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
                  <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} checked={time.open} onChange={(e) => setFormData(prev => ({ ...prev, schedule: { ...prev.schedule, [day]: { ...time, open: e.target.checked } } }))} />
                  <div style={{ width: 36, height: 20, borderRadius: 9999, background: time.open ? "var(--primary)" : "#CBD5E1", position: "relative", transition: "background 0.2s" }}>
                    <div style={{ position: "absolute", top: 2, left: time.open ? 18 : 2, width: 16, height: 16, borderRadius: "50%", background: "white", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", transition: "left 0.2s" }} />
                  </div>
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", opacity: time.open ? 1 : 0.5, pointerEvents: time.open ? "auto" : "none", flex: 1, minWidth: 0 }}>
                  <input type="time" value={time.start} onChange={(e) => setFormData(prev => ({ ...prev, schedule: { ...prev.schedule, [day]: { ...time, start: e.target.value } } }))} style={{ flex: 1, minWidth: 0, height: 34, borderRadius: 8, border: "1px solid var(--border)", padding: "0 8px", fontSize: "12px", outline: "none", background: "white" }} />
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>à</span>
                  <input type="time" value={time.end} onChange={(e) => setFormData(prev => ({ ...prev, schedule: { ...prev.schedule, [day]: { ...time, end: e.target.value } } }))} style={{ flex: 1, minWidth: 0, height: 34, borderRadius: 8, border: "1px solid var(--border)", padding: "0 8px", fontSize: "12px", outline: "none", background: "white" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Préférences de notification */}
        <div style={{ padding: "1.25rem", background: "white", borderRadius: 18 }}>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "0.875rem" }}>Préférences de notification</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
            {[
              { id: "email", label: "Nouvelles commandes par email", value: formData.notifications.email },
              { id: "sms", label: "Nouvelles commandes par SMS", value: formData.notifications.sms },
              { id: "reviews", label: "Avis clients", value: formData.notifications.reviews },
              { id: "promos", label: "Promotions DarnaFood", value: formData.notifications.promos },
            ].map(notif => (
              <div key={notif.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.625rem" }}>
                <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{notif.label}</span>
                <label style={{ position: "relative", display: "inline-flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}>
                  <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} checked={notif.value} onChange={(e) => setFormData(prev => ({ ...prev, notifications: { ...prev.notifications, [notif.id]: e.target.checked } }))} />
                  <div style={{ width: 40, height: 22, borderRadius: 9999, background: notif.value ? "var(--primary)" : "#CBD5E1", position: "relative", transition: "background 0.2s ease" }}>
                    <div style={{ position: "absolute", top: 2, left: notif.value ? 20 : 2, width: 18, height: 18, borderRadius: "50%", background: "white", boxShadow: "0 1px 2px rgba(0,0,0,0.1)", transition: "left 0.2s ease" }} />
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </form>

      {/* ── Right Column: Preview Card ── */}
      <div className="cook-preview-card" style={{ width: 320, position: "sticky", top: 88, flexShrink: 0 }}>
        <div style={{ fontSize: "11px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.75rem" }}>
          Aperçu public
        </div>
        <div style={{ background: "white", borderRadius: 18, padding: "1.25rem", textAlign: "center", boxShadow: "var(--shadow-card)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--primary)", margin: "0 auto 0.875rem", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
            {avatarSrc ? <Image src={avatarSrc} alt="Avatar" fill style={{ objectFit: "cover" }} /> : <User size={26} color="white" />}
          </div>
          <h4 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {formData.name || "Votre nom"}
          </h4>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: "12px", color: "var(--text-muted)", marginBottom: "0.625rem" }}>
            <MapPin size={12} /> {formData.commune || "Quartier"}, {formData.wilaya}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: "13px", color: "var(--text-primary)", fontWeight: 600, marginBottom: "0.875rem" }}>
            <Star size={14} fill="var(--secondary)" color="var(--secondary)" /> 4.8 <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>(42 avis)</span>
          </div>
          <Link href={`/cooks/${user.id}`} style={{ display: "inline-block", color: "var(--primary)", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
            Voir mon profil public →
          </Link>
        </div>
      </div>

      {/* ── Sticky Footer Bar ── */}
      <div className="cook-form-footer" style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "flex-end",
        padding: "0.75rem 1rem", gap: "0.625rem", zIndex: 30,
      }}>
        <button
          type="button"
          onClick={() => window.location.reload()}
          style={{ height: 40, padding: "0 0.875rem", borderRadius: 10, background: "transparent", color: "var(--text-secondary)", border: "none", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4 }}
        >
          <RotateCcw size={13} /> Annuler
        </button>
        <button
          type="submit"
          form="cook-profile-form"
          disabled={isSubmitting}
          style={{ height: 40, padding: "0 1rem", borderRadius: 10, background: "var(--primary)", color: "white", border: "none", fontSize: "13px", fontWeight: 600, cursor: isSubmitting ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 4, opacity: isSubmitting ? 0.8 : 1 }}
        >
          <Save size={13} /> {isSubmitting ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>

      <style>{`
        @media (min-width: 1025px) {
          .cook-form-footer { left: 280px !important; }
        }
        @media (max-width: 1024px) {
          .cook-profile-layout { flex-direction: column !important; }
          .cook-preview-card { width: 100% !important; position: static !important; }
        }
        @media (max-width: 640px) {
          .form-grid-2 { grid-template-columns: 1fr !important; }
          .cook-schedule-row { padding: 0.25rem 0 !important; }
          .cook-schedule-row > div:last-child { flex-basis: 100% !important; }
        }
      `}</style>
    </div>
  );
}
