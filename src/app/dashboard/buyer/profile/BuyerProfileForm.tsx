"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { User, Camera, Save, MapPin, Phone, Mail } from "lucide-react";
import BuyerSidebar from "@/components/dashboard/BuyerSidebar";

const WILAYAS = ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Tizi Ouzou", "Sétif", "Batna", "Béjaïa", "Tlemcen"];

interface BuyerProfileFormProps {
  initialUser: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
    image: string | null;
  };
}

export default function BuyerProfileForm({ initialUser }: BuyerProfileFormProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [form, setForm] = useState({
    name: initialUser.name || "",
    email: initialUser.email || "",
    phone: initialUser.phone || "",
    wilaya: "Alger",
    quartier: "",
    address: "",
  });

  const [avatarSrc, setAvatarSrc] = useState<string | null>(initialUser.image);
  const [newAvatarBase64, setNewAvatarBase64] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedWilaya = localStorage.getItem("buyer_wilaya") || "Alger";
      const storedQuartier = localStorage.getItem("buyer_quartier") || "";
      const storedAddress = localStorage.getItem("buyer_address") || "";
      setForm(f => ({ ...f, wilaya: storedWilaya, quartier: storedQuartier, address: storedAddress }));
    }
  }, []);

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

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("buyer_wilaya", form.wilaya);
        localStorage.setItem("buyer_quartier", form.quartier);
        localStorage.setItem("buyer_address", form.address);
      }
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, phone: form.phone, newAvatarBase64 }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur de mise à jour");
      }
      toast.success("Profil mis à jour !");
      setSaved(true);
      setNewAvatarBase64(null);
      setTimeout(() => setSaved(false), 2500);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  const userInitial = (form.name && form.name[0]) ? form.name[0].toUpperCase() : "U";
  const userName = session?.user?.name ?? form.name ?? undefined;
  const userInit = session?.user?.name?.[0]?.toUpperCase() ?? userInitial;

  const field = (label: string, key: keyof typeof form, type = "text", placeholder = "", disabled = false, Icon?: any) => (
    <div>
      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "0.4rem" }}>{label}</label>
      <div style={{ position: "relative" }}>
        {Icon && <Icon size={14} color="#94A3B8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />}
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          placeholder={placeholder}
          disabled={disabled}
          style={{
            width: "100%",
            height: 44,
            borderRadius: 10,
            border: "1.5px solid #E2E8F0",
            padding: Icon ? `0 1rem 0 2.25rem` : "0 1rem",
            fontSize: "14px",
            color: disabled ? "#64748B" : "#0F172A",
            background: disabled ? "#F8FAFC" : "white",
            outline: "none",
            transition: "border-color 150ms",
            boxSizing: "border-box",
          }}
          onFocus={e => { if (!disabled) e.currentTarget.style.borderColor = "#F97316"; }}
          onBlur={e => { if (!disabled) e.currentTarget.style.borderColor = "#E2E8F0"; }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", paddingTop: 72 }}>
      <div style={{ maxWidth: 1152, margin: "0 auto", padding: "1.5rem 1rem", display: "grid", gridTemplateColumns: "240px 1fr", gap: "1.5rem", alignItems: "flex-start" }} className="buyer-grid">

        <BuyerSidebar userName={userName} userInitial={userInit} />

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.25rem, 3vw, 1.75rem)", fontWeight: 800, color: "#0F172A" }}>Mon profil</h1>

          {/* Avatar */}
          <div style={{ background: "white", borderRadius: 18, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #F97316, #EA580C)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "28px", fontWeight: 800, overflow: "hidden", position: "relative" }}>
                  {avatarSrc ? <Image src={avatarSrc} alt="Avatar" fill style={{ objectFit: "cover" }} /> : userInitial}
                </div>
                <label style={{ position: "absolute", bottom: 0, right: 0, width: 26, height: 26, borderRadius: "50%", background: "#F97316", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <Camera size={12} color="white" />
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
                </label>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A" }}>{form.name || "Utilisateur"}</div>
                <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: 2 }}>{form.email}</div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "#F97316", background: "none", border: "none", cursor: "pointer", marginTop: 6, display: "inline-block" }}>
                  Changer la photo
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
                </label>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} style={{ background: "white", borderRadius: 18, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #F1F5F9" }}>
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", marginBottom: "1rem" }}>Informations personnelles</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }} className="form-grid">
              {field("Nom complet", "name", "text", "", false, User)}
              {field("Email", "email", "email", "", true, Mail)}
            </div>
            <div style={{ marginBottom: "1rem" }}>{field("Téléphone", "phone", "tel", "", false, Phone)}</div>
            <hr style={{ border: "none", borderTop: "1px solid #F1F5F9", margin: "1rem 0" }} />
            <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", marginBottom: "1rem" }}>Adresse principale</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }} className="form-grid">
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: "0.4rem" }}>Wilaya</label>
                <div style={{ position: "relative" }}>
                  <MapPin size={14} color="#94A3B8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  <select value={form.wilaya} onChange={e => setForm(f => ({ ...f, wilaya: e.target.value }))} style={{ width: "100%", height: 44, borderRadius: 10, border: "1.5px solid #E2E8F0", padding: "0 1rem 0 2.25rem", fontSize: "14px", color: "#0F172A", background: "white", outline: "none" }}>
                    {WILAYAS.map(w => <option key={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              {field("Quartier", "quartier")}
            </div>
            <div style={{ marginBottom: "1.25rem" }}>{field("Adresse exacte", "address")}</div>
            <button type="submit" disabled={isSubmitting} style={{ height: 44, padding: "0 1.5rem", borderRadius: 10, background: saved ? "#22C55E" : "#F97316", color: "white", border: "none", fontSize: "14px", fontWeight: 600, cursor: isSubmitting ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem", transition: "background 300ms", opacity: isSubmitting ? 0.8 : 1 }}>
              <Save size={15} />
              {isSubmitting ? "Enregistrement..." : saved ? "Enregistré !" : "Sauvegarder"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .buyer-grid { grid-template-columns: 1fr !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
