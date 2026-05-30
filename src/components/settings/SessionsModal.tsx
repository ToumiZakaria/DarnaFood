"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { X, Monitor, Smartphone, Globe, Loader2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

interface Session {
  id: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  ip: string | null;
  lastActiveAt: string;
  createdAt: string;
}

interface SessionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SessionsModal({ isOpen, onClose }: SessionsModalProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadSessions();
    }
  }, [isOpen]);

  async function loadSessions() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/sessions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSessions(data.sessions);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/auth/sessions/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSessions(prev => prev.filter(s => s.id !== id));
      toast.success("Session révoquée");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (!isOpen) return null;

  function getIcon(session: Session) {
    const agent = (session.browser || session.os || "").toLowerCase();
    if (agent.includes("mobile") || agent.includes("android") || agent.includes("iphone")) {
      return <Smartphone size={20} />;
    }
    if (agent.includes("chrome") || agent.includes("firefox") || agent.includes("safari")) {
      return <Monitor size={20} />;
    }
    return <Monitor size={20} />;
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <div style={{ background: "white", borderRadius: 20, padding: "2rem", maxWidth: 520, width: "100%", boxShadow: "0 20px 50px rgba(0,0,0,0.2)", maxHeight: "80vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F0FDFA", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Globe size={20} color="#0D9488" />
            </div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: 0 }}>Sessions actives</h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#94A3B8" }}>
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "3rem" }}>
            <Loader2 size={24} style={{ animation: "spin 1s linear infinite", color: "#94A3B8" }} />
          </div>
        ) : sessions.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "#94A3B8", fontSize: "14px" }}>Aucune session active</p>
        ) : (
          <div style={{ overflowY: "auto", flex: 1 }}>
            {sessions.map(s => (
              <div key={s.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderBottom: "1px solid #F1F5F9" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", flexShrink: 0 }}>
                  {getIcon(s)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A" }}>
                    {[s.browser, s.os].filter(Boolean).join(" — ") || "Appareil inconnu"}
                  </div>
                  <div style={{ fontSize: "13px", color: "#94A3B8", marginTop: 2 }}>
                    {s.ip ? `${s.ip} · ` : ""}
                    {(() => {
                      try {
                        return `Dernière activité ${formatDistanceToNow(new Date(s.lastActiveAt), { addSuffix: true, locale: fr })}`;
                      } catch { return ""; }
                    })()}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={deletingId === s.id}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "transparent",
                    border: "1px solid #FEE2E2",
                    cursor: deletingId === s.id ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#EF4444",
                    flexShrink: 0,
                  }}
                >
                  {deletingId === s.id ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Trash2 size={16} />}
                </button>
              </div>
            ))}
          </div>
        )}

        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
