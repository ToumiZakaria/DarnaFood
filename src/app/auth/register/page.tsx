"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { WILAYAS } from "@/lib/wilayas";

type Step = 1 | 2 | 3;
type Role = "CUSTOMER" | "COOK";

interface FormData {
  // Step 1
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  // Step 2
  role: Role;
  // Step 3 (Cook only)
  wilaya: string;
  commune: string;
  address: string;
  bio: string;
}

const INITIAL: FormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  role: "CUSTOMER",
  wilaya: "",
  commune: "",
  address: "",
  bio: "",
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  function set(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // ── Step navigation ──────────────────────────────────────────
  function nextStep() {
    if (step === 1) {
      if (!form.name.trim()) return toast.error("Votre nom est requis.");
      if (!form.email.trim()) return toast.error("Votre email est requis.");
      if (form.password.length < 8) return toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      if (form.password !== form.confirmPassword) return toast.error("Les mots de passe ne correspondent pas.");
    }
    if (step === 2 && form.role === "CUSTOMER") {
      // Skip step 3 for customers → submit directly
      handleSubmit();
      return;
    }
    setStep((s) => (s + 1) as Step);
  }

  function prevStep() {
    setStep((s) => (s - 1) as Step);
  }

  // ── Submit ───────────────────────────────────────────────────
  async function handleSubmit() {
    if (form.role === "COOK") {
      if (!form.wilaya) return toast.error("Sélectionnez votre wilaya.");
      if (!form.commune.trim()) return toast.error("Votre commune est requise.");
      if (!form.address.trim()) return toast.error("Votre adresse est requise.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
          role: form.role,
          wilaya: form.wilaya,
          commune: form.commune,
          address: form.address,
          bio: form.bio,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Une erreur est survenue.");
        return;
      }

      toast.success("Compte créé ! Connexion en cours…");

      // Auto-sign in after registration
      const signInRes = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (signInRes?.ok) {
        router.push(form.role === "COOK" ? "/cook/dashboard" : "/");
        router.refresh();
      } else {
        router.push("/auth/login");
      }
    } catch {
      toast.error("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/" });
  }

  const totalSteps = form.role === "COOK" ? 3 : 2;
  const progress = ((step - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="auth-page">
      <div className="auth-bg-blob auth-bg-blob--1" />
      <div className="auth-bg-blob auth-bg-blob--2" />

      <div className="auth-card register-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo-icon">🍽️</span>
          <span className="auth-logo-text">DarnaFood</span>
        </div>

        {/* Progress bar */}
        <div className="progress-bar-wrapper" aria-label={`Étape ${step} sur ${totalSteps}`}>
          <div className="progress-steps">
            {[1, 2, ...(form.role === "COOK" ? [3] : [])].map((s) => (
              <div
                key={s}
                className={`progress-step ${step >= s ? "progress-step--active" : ""} ${step > s ? "progress-step--done" : ""}`}
              >
                <span className="progress-step-dot">
                  {step > s ? "✓" : s}
                </span>
                <span className="progress-step-label">
                  {s === 1 ? "Informations" : s === 2 ? "Rôle" : "Profil cuisinier"}
                </span>
              </div>
            ))}
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* ── STEP 1: Personal Info ── */}
        {step === 1 && (
          <div className="step-content">
            <h1 className="auth-title">Créer un compte</h1>
            <p className="auth-subtitle">Vos informations personnelles</p>

            <button
              id="btn-google-register"
              type="button"
              className="btn-google"
              onClick={handleGoogle}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <span className="spinner-sm" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
              )}
              Continuer avec Google
            </button>

            <div className="auth-divider"><span>ou</span></div>

            <div className="form-grid">
              <div className="form-group form-col-full">
                <label htmlFor="reg-name" className="form-label">Nom complet <span className="required">*</span></label>
                <input id="reg-name" type="text" className="form-input" placeholder="Votre nom" value={form.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" />
              </div>
              <div className="form-group form-col-full">
                <label htmlFor="reg-email" className="form-label">Adresse email <span className="required">*</span></label>
                <input id="reg-email" type="email" className="form-input" placeholder="vous@exemple.com" value={form.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" />
              </div>
              <div className="form-group form-col-full">
                <label htmlFor="reg-phone" className="form-label">Téléphone</label>
                <input id="reg-phone" type="tel" className="form-input" placeholder="0555 000 000" value={form.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
              </div>
              <div className="form-group">
                <label htmlFor="reg-password" className="form-label">Mot de passe <span className="required">*</span></label>
                <div className="input-password-wrapper">
                  <input id="reg-password" type={showPassword ? "text" : "password"} className="form-input" placeholder="Min. 8 caractères" value={form.password} onChange={(e) => set("password", e.target.value)} autoComplete="new-password" />
                  <button type="button" className="input-password-toggle" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password">
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="password-strength">
                    <div className={`strength-bar ${form.password.length >= 8 ? (form.password.length >= 12 ? "strength--strong" : "strength--medium") : "strength--weak"}`} />
                    <span className="strength-label">
                      {form.password.length < 8 ? "Trop court" : form.password.length < 12 ? "Moyen" : "Fort"}
                    </span>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="reg-confirm" className="form-label">Confirmer le mot de passe <span className="required">*</span></label>
                <input id="reg-confirm" type="password" className={`form-input ${form.confirmPassword && form.password !== form.confirmPassword ? "input--error" : ""}`} placeholder="••••••••" value={form.confirmPassword} onChange={(e) => set("confirmPassword", e.target.value)} autoComplete="new-password" />
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <span className="field-error">Les mots de passe ne correspondent pas</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Role Selection ── */}
        {step === 2 && (
          <div className="step-content">
            <h1 className="auth-title">Votre rôle</h1>
            <p className="auth-subtitle">Comment souhaitez-vous utiliser DarnaFood ?</p>

            <div className="role-cards">
              <button
                id="role-customer"
                type="button"
                className={`role-card ${form.role === "CUSTOMER" ? "role-card--active" : ""}`}
                onClick={() => set("role", "CUSTOMER")}
              >
                <span className="role-icon">🛒</span>
                <span className="role-name">Client</span>
                <span className="role-desc">Je souhaite commander des plats faits maison</span>
                <span className="role-check">{form.role === "CUSTOMER" ? "✓" : ""}</span>
              </button>

              <button
                id="role-cook"
                type="button"
                className={`role-card ${form.role === "COOK" ? "role-card--active" : ""}`}
                onClick={() => set("role", "COOK")}
              >
                <span className="role-icon">👨‍🍳</span>
                <span className="role-name">Cuisinier</span>
                <span className="role-desc">Je souhaite vendre mes plats faits maison</span>
                <span className="role-check">{form.role === "COOK" ? "✓" : ""}</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Cook Profile ── */}
        {step === 3 && (
          <div className="step-content">
            <h1 className="auth-title">Votre profil cuisinier</h1>
            <p className="auth-subtitle">Ces infos aident les clients à vous trouver</p>

            <div className="form-grid">
              <div className="form-group form-col-full">
                <label htmlFor="reg-wilaya" className="form-label">Wilaya <span className="required">*</span></label>
                <select id="reg-wilaya" className="form-input form-select" value={form.wilaya} onChange={(e) => set("wilaya", e.target.value)}>
                  <option value="">Sélectionnez votre wilaya</option>
                  {WILAYAS.map((w) => (
                    <option key={w.code} value={w.name}>{w.code} — {w.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="reg-commune" className="form-label">Commune <span className="required">*</span></label>
                <input id="reg-commune" type="text" className="form-input" placeholder="Votre commune" value={form.commune} onChange={(e) => set("commune", e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="reg-address" className="form-label">Adresse <span className="required">*</span></label>
                <input id="reg-address" type="text" className="form-input" placeholder="Rue, cité…" value={form.address} onChange={(e) => set("address", e.target.value)} />
              </div>
              <div className="form-group form-col-full">
                <label htmlFor="reg-bio" className="form-label">Bio / Spécialité</label>
                <textarea id="reg-bio" className="form-input form-textarea" placeholder="Décrivez vos spécialités culinaires…" value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} />
              </div>
            </div>
          </div>
        )}

        {/* ── Navigation Buttons ── */}
        <div className="step-actions">
          {step > 1 && (
            <button type="button" className="btn-back" onClick={prevStep} disabled={loading}>
              ← Retour
            </button>
          )}
          <button
            id="btn-register-next"
            type="button"
            className="btn btn-primary btn-auth"
            onClick={step === 3 || (step === 2 && form.role === "CUSTOMER") ? handleSubmit : nextStep}
            disabled={loading}
          >
            {loading && <span className="spinner-sm" />}
            {loading
              ? "Création…"
              : step === 3 || (step === 2 && form.role === "CUSTOMER")
              ? "Créer mon compte"
              : "Continuer →"}
          </button>
        </div>

        <p className="auth-footer-text">
          Déjà un compte ?{" "}
          <Link href="/auth/login" className="auth-link">Se connecter</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
        }
        .auth-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
          pointer-events: none;
          z-index: 0;
        }
        .auth-bg-blob--1 {
          width: 500px; height: 500px;
          background: var(--primary);
          top: -150px; right: -150px;
        }
        .auth-bg-blob--2 {
          width: 400px; height: 400px;
          background: var(--secondary);
          bottom: -100px; left: -100px;
        }

        .auth-card {
          position: relative; z-index: 1;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 1.5rem;
          padding: 2.5rem 2rem;
          width: 100%; max-width: 520px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-logo {
          display: flex; align-items: center;
          gap: 0.5rem; justify-content: center;
          margin-bottom: 1.5rem;
        }
        .auth-logo-icon { font-size: 1.75rem; }
        .auth-logo-text {
          font-family: var(--font-heading);
          font-size: 1.5rem; font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Progress */
        .progress-bar-wrapper { margin-bottom: 2rem; }
        .progress-steps {
          display: flex; justify-content: space-between;
          position: relative; margin-bottom: 0.5rem;
        }
        .progress-step {
          display: flex; flex-direction: column;
          align-items: center; gap: 0.25rem;
          flex: 1;
        }
        .progress-step-dot {
          width: 32px; height: 32px;
          border-radius: 50%;
          border: 2px solid var(--border);
          background: var(--bg);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 600;
          color: var(--text-muted);
          transition: all 0.3s ease;
          position: relative; z-index: 1;
        }
        .progress-step--active .progress-step-dot {
          border-color: var(--primary);
          background: var(--primary);
          color: white;
        }
        .progress-step--done .progress-step-dot {
          border-color: var(--secondary);
          background: var(--secondary);
          color: white;
        }
        .progress-step-label {
          font-size: 0.7rem;
          color: var(--text-muted);
          text-align: center;
          white-space: nowrap;
        }
        .progress-step--active .progress-step-label { color: var(--primary-dark); font-weight: 600; }
        .progress-track {
          height: 3px; background: var(--border);
          border-radius: 99px; margin: 0 1rem;
          position: relative; top: -36px;
          z-index: 0;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          border-radius: 99px;
          transition: width 0.4s ease;
        }

        .step-content { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }

        .auth-title {
          font-family: var(--font-heading);
          font-size: 1.75rem; font-weight: 700;
          color: var(--text-primary);
          text-align: center; margin: 0 0 0.25rem;
        }
        .auth-subtitle {
          color: var(--text-secondary);
          text-align: center; margin: 0 0 1.5rem;
          font-size: 0.925rem;
        }

        .btn-google {
          width: 100%;
          display: flex; align-items: center;
          justify-content: center; gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: 0.925rem; font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-google:hover {
          background: var(--bg-secondary);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .btn-google:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .auth-divider {
          display: flex; align-items: center;
          gap: 1rem; margin: 1.25rem 0;
          color: var(--text-muted); font-size: 0.8rem;
        }
        .auth-divider::before, .auth-divider::after {
          content: ""; flex: 1; height: 1px; background: var(--border);
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-col-full { grid-column: 1 / -1; }
        .form-group { display: flex; flex-direction: column; gap: 0.375rem; }
        .form-label { font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); }
        .required { color: var(--error); }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--bg);
          color: var(--text-primary);
          font-family: var(--font-body);
          font-size: 0.925rem;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
        }
        .form-input::placeholder { color: var(--text-muted); }
        .input--error { border-color: var(--error) !important; }
        .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath fill='%23666' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; padding-right: 2.5rem; }
        .form-textarea { resize: vertical; min-height: 80px; }

        .input-password-wrapper { position: relative; }
        .input-password-wrapper .form-input { padding-right: 3rem; }
        .input-password-toggle {
          position: absolute; right: 0.875rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 1rem; line-height: 1; padding: 0; color: var(--text-muted);
        }

        .password-strength {
          display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem;
        }
        .strength-bar {
          flex: 1; height: 4px; border-radius: 99px;
          background: var(--border);
          transition: background 0.3s;
        }
        .strength--weak { background: var(--error); }
        .strength--medium { background: var(--primary); }
        .strength--strong { background: var(--secondary); }
        .strength-label { font-size: 0.75rem; color: var(--text-muted); white-space: nowrap; }
        .field-error { font-size: 0.75rem; color: var(--error); margin-top: 0.125rem; }

        /* Role Cards */
        .role-cards { display: flex; flex-direction: column; gap: 1rem; margin: 1rem 0; }
        .role-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          grid-template-rows: auto auto;
          column-gap: 1rem;
          align-items: center;
          padding: 1.25rem 1.5rem;
          border: 2px solid var(--border);
          border-radius: var(--radius-lg);
          background: var(--bg);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          width: 100%;
        }
        .role-card:hover {
          border-color: var(--primary-light);
          background: var(--primary-subtle);
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(245, 158, 11, 0.12);
        }
        .role-card--active {
          border-color: var(--primary);
          background: var(--primary-subtle);
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
        }
        .role-icon { font-size: 2rem; grid-row: 1 / 3; }
        .role-name { font-weight: 700; font-size: 1rem; color: var(--text-primary); }
        .role-desc { font-size: 0.825rem; color: var(--text-secondary); grid-column: 2; }
        .role-check {
          grid-row: 1 / 3; grid-column: 3;
          width: 24px; height: 24px;
          border-radius: 50%;
          background: var(--primary);
          color: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700;
          opacity: 0; transition: opacity 0.2s;
        }
        .role-card--active .role-check { opacity: 1; }

        /* Actions */
        .step-actions {
          display: flex; gap: 0.75rem;
          margin-top: 1.75rem;
        }
        .btn-back {
          padding: 0.875rem 1.25rem;
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--text-secondary);
          font-family: var(--font-body);
          font-size: 0.925rem; font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .btn-back:hover { background: var(--bg-secondary); }
        .btn-auth {
          flex: 1;
          padding: 0.875rem;
          border-radius: var(--radius-md);
          font-size: 1rem; font-weight: 600;
          display: flex; align-items: center;
          justify-content: center; gap: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: var(--primary); color: white;
        }
        .btn-auth:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
        }
        .btn-auth:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .spinner-sm {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-footer-text {
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-top: 1.5rem;
        }
        .auth-link { color: var(--primary-dark); font-weight: 600; text-decoration: none; }
        .auth-link:hover { text-decoration: underline; }

        @media (max-width: 480px) {
          .auth-card { padding: 1.75rem 1.25rem; }
          .form-grid { grid-template-columns: 1fr; }
          .form-col-full { grid-column: 1; }
          .progress-step-label { display: none; }
        }
      `}</style>
    </div>
  );
}
