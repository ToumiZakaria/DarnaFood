"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

const ERROR_MESSAGES: Record<string, { title: string; message: string; emoji: string }> = {
  Configuration: {
    emoji: "⚙️",
    title: "Erreur de configuration",
    message: "Le serveur n'est pas correctement configuré. Contactez l'administrateur.",
  },
  AccessDenied: {
    emoji: "🚫",
    title: "Accès refusé",
    message: "Vous n'avez pas la permission d'accéder à cette page.",
  },
  Verification: {
    emoji: "📧",
    title: "Lien expiré",
    message: "Le lien de vérification a expiré ou a déjà été utilisé.",
  },
  OAuthSignin: {
    emoji: "🔐",
    title: "Erreur de connexion Google",
    message: "Une erreur s'est produite lors de la connexion avec Google. Réessayez.",
  },
  OAuthCallback: {
    emoji: "🔄",
    title: "Erreur de retour Google",
    message: "La connexion Google n'a pas pu être finalisée. Réessayez.",
  },
  OAuthAccountNotLinked: {
    emoji: "🔗",
    title: "Compte déjà existant",
    message:
      "Un compte avec cet email existe déjà. Connectez-vous avec votre email et mot de passe, puis liez votre compte Google depuis votre profil.",
  },
  CredentialsSignin: {
    emoji: "🔑",
    title: "Identifiants incorrects",
    message: "L'email ou le mot de passe est incorrect. Veuillez réessayer.",
  },
  SessionRequired: {
    emoji: "🔒",
    title: "Connexion requise",
    message: "Vous devez être connecté pour accéder à cette page.",
  },
  Default: {
    emoji: "❌",
    title: "Une erreur est survenue",
    message: "Une erreur inattendue s'est produite. Veuillez réessayer.",
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error") || "Default";
  const error = ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.Default;

  return (
    <div className="error-page">
      <div className="error-bg-blob error-bg-blob--1" />
      <div className="error-bg-blob error-bg-blob--2" />

      <div className="error-card">
        {/* Logo */}
        <Link href="/" className="auth-logo">
          <span>🍽️</span>
          <span className="auth-logo-text">DarnaFood</span>
        </Link>

        {/* Error Icon */}
        <div className="error-icon-wrapper">
          <span className="error-emoji">{error.emoji}</span>
          <div className="error-ring" />
        </div>

        <h1 className="error-title">{error.title}</h1>
        <p className="error-message">{error.message}</p>

        {/* Debug code for developers */}
        {errorCode !== "Default" && (
          <div className="error-code-badge">
            Code: <code>{errorCode}</code>
          </div>
        )}

        {/* Actions */}
        <div className="error-actions">
          <Link href="/auth/login" id="btn-error-login" className="btn-primary-link">
            🔑 Se connecter
          </Link>
          <Link href="/" id="btn-error-home" className="btn-secondary-link">
            🏠 Retour à l&apos;accueil
          </Link>
        </div>

        <p className="error-help">
          Besoin d&apos;aide ?{" "}
          <a href="mailto:support@darnafood.dz" className="error-contact">
            Contacter le support
          </a>
        </p>
      </div>

      <style jsx>{`
        .error-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          padding: 2rem 1rem;
          position: relative;
          overflow: hidden;
        }
        .error-bg-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.1;
          pointer-events: none;
        }
        .error-bg-blob--1 {
          width: 500px; height: 500px;
          background: #ef4444;
          top: -200px; right: -150px;
        }
        .error-bg-blob--2 {
          width: 400px; height: 400px;
          background: var(--primary);
          bottom: -150px; left: -100px;
        }

        .error-card {
          position: relative; z-index: 1;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 1.5rem;
          padding: 2.5rem 2rem;
          width: 100%; max-width: 440px;
          text-align: center;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          animation: slideUp 0.4s ease;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .auth-logo {
          display: inline-flex; align-items: center;
          gap: 0.5rem; text-decoration: none;
          margin-bottom: 2rem;
          font-size: 1.25rem;
        }
        .auth-logo-text {
          font-family: var(--font-heading);
          font-size: 1.25rem; font-weight: 800;
          background: linear-gradient(135deg, var(--primary), var(--accent));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .error-icon-wrapper {
          position: relative;
          width: 80px; height: 80px;
          margin: 0 auto 1.5rem;
          display: flex; align-items: center; justify-content: center;
        }
        .error-emoji {
          font-size: 2.5rem;
          position: relative; z-index: 1;
          animation: bounce 0.6s ease;
        }
        @keyframes bounce {
          0%   { transform: scale(0); }
          60%  { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        .error-ring {
          position: absolute; inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(239, 68, 68, 0.2);
          background: rgba(239, 68, 68, 0.06);
          animation: pulse 2s ease infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.08); opacity: 0.6; }
        }

        .error-title {
          font-family: var(--font-heading);
          font-size: 1.5rem; font-weight: 700;
          color: var(--text-primary);
          margin: 0 0 0.75rem;
        }
        .error-message {
          color: var(--text-secondary);
          font-size: 0.925rem;
          line-height: 1.6;
          margin: 0 0 1.25rem;
        }

        .error-code-badge {
          display: inline-block;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 0.5rem;
          padding: 0.375rem 0.875rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 1.5rem;
        }
        .error-code-badge code {
          font-family: monospace;
          color: var(--text-secondary);
        }

        .error-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }
        .btn-primary-link {
          display: block;
          padding: 0.875rem;
          background: var(--primary);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-primary-link:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(245, 158, 11, 0.35);
        }
        .btn-secondary-link {
          display: block;
          padding: 0.875rem;
          background: var(--bg);
          color: var(--text-secondary);
          border: 1.5px solid var(--border);
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-secondary-link:hover {
          background: var(--bg-secondary);
          transform: translateY(-1px);
        }

        .error-help {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin: 0;
        }
        .error-contact {
          color: var(--primary-dark);
          font-weight: 600;
          text-decoration: none;
        }
        .error-contact:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Chargement...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
