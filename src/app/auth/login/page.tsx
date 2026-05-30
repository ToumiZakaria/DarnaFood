"use client";

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      toast.error("Email ou mot de passe incorrect.");
    } else {
      toast.success("Bienvenue dans votre espace cuisinier !");
      const session = await getSession();
      if (session?.user?.role === "COOK") {
        router.push("/cook/dashboard");
      } else {
        router.push(callbackUrl);
      }
      router.refresh();
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <div className="auth-page">
      {/* Background decoration */}
      <div className="auth-bg-blob auth-bg-blob--1" />
      <div className="auth-bg-blob auth-bg-blob--2" />

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <span className="auth-logo-icon">🍽️</span>
          <span className="auth-logo-text">DarnaFood</span>
        </div>

        <h1 className="auth-title">Bon retour !</h1>
        <p className="auth-subtitle">Connectez-vous à votre compte</p>

        {/* Google Sign In */}
        <button
          id="btn-google-signin"
          type="button"
          className="btn-google"
          onClick={handleGoogle}
          disabled={googleLoading}
        >
          {googleLoading ? (
            <span className="spinner-sm" />
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continuer avec Google
        </button>

        <div className="auth-divider">
          <span>ou</span>
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">
              Adresse email
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="vous@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password" className="form-label">
              Mot de passe
            </label>
            <div className="input-password-wrapper">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            className="btn btn-primary btn-auth"
            disabled={loading}
          >
            {loading ? <span className="spinner-sm" /> : null}
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>

        <p className="auth-footer-text">
          Pas encore de compte ?{" "}
          <Link href="/auth/register" className="auth-link">
            Créer un compte
          </Link>
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
          width: 500px;
          height: 500px;
          background: var(--primary);
          top: -150px;
          right: -150px;
        }
        .auth-bg-blob--2 {
          width: 400px;
          height: 400px;
          background: var(--secondary);
          bottom: -100px;
          left: -100px;
        }

        .auth-card {
          position: relative;
          z-index: 1;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 1.5rem;
          padding: 2.5rem 2rem;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          animation: slideUp 0.4s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .auth-logo-icon { font-size: 1.75rem; }
        .auth-logo-text {
          font-family: var(--font-heading);
          font-size: 1.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .auth-title {
          font-family: var(--font-heading);
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--text-primary);
          text-align: center;
          margin: 0 0 0.25rem;
        }
        .auth-subtitle {
          color: var(--text-secondary);
          text-align: center;
          margin: 0 0 1.75rem;
          font-size: 0.925rem;
        }

        .btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.75rem 1.25rem;
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: 0.925rem;
          font-weight: 500;
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-google:hover {
          background: var(--bg-secondary);
          border-color: var(--text-muted);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        }
        .btn-google:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .auth-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.25rem 0;
          color: var(--text-muted);
          font-size: 0.8rem;
        }
        .auth-divider::before,
        .auth-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        .auth-form { display: flex; flex-direction: column; gap: 1rem; }

        .form-group { display: flex; flex-direction: column; gap: 0.375rem; }

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--text-secondary);
        }

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

        .input-password-wrapper { position: relative; }
        .input-password-wrapper .form-input { padding-right: 3rem; }
        .input-password-toggle {
          position: absolute;
          right: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          line-height: 1;
          padding: 0;
          color: var(--text-muted);
        }

        .btn-auth {
          width: 100%;
          padding: 0.875rem;
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
          background: var(--primary);
          color: white;
        }
        .btn-auth:hover:not(:disabled) {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
        }
        .btn-auth:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .spinner-sm {
          width: 16px;
          height: 16px;
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
        .auth-link {
          color: var(--primary-dark);
          font-weight: 600;
          text-decoration: none;
        }
        .auth-link:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Chargement...</div>}>
      <LoginContent />
    </Suspense>
  );
}
