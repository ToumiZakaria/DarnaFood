"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";

interface Suggestion {
  type: "dish" | "cook" | "category";
  id: string;
  text: string;
  subtitle: string;
}

interface SearchBarProps {
  variant?: "hero" | "compact" | "navbar";
  placeholder?: string;
  basePath?: string;
}

export default function SearchBar({
  variant = "hero",
  placeholder = "Chercher un plat, un cuisinier…",
  basePath = "/dishes",
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setOpen(true);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(query), 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, fetchSuggestions]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`${basePath}?q=${encodeURIComponent(query.trim())}`);
  }

  function handleSuggestionClick(s: Suggestion) {
    setOpen(false);
    if (s.type === "category") {
      router.push(`/dishes?category=${s.id}`);
    } else if (s.type === "cook") {
      router.push(`/cooks/${s.id}`);
    } else {
      router.push(`/dishes/${s.id}`);
    }
  }

  const isCompact = variant === "compact";
  const isNavbar = variant === "navbar";
  const height = isCompact ? 40 : isNavbar ? 38 : 56;
  const borderRadius = isCompact ? 10 : isNavbar ? 10 : 14;

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%", maxWidth: isNavbar ? 320 : 640 }}>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height,
            borderRadius,
            background: "white",
            border: isNavbar ? "1.5px solid #E2E8F0" : `1px solid #F1F5F9`,
            boxShadow: isNavbar ? "none" : "0 8px 30px rgba(0,0,0,0.08)",
            padding: "0 0.5rem",
            transition: "box-shadow 200ms, border-color 200ms",
          }}
          onMouseEnter={e => { if (!isNavbar) e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"; }}
          onMouseLeave={e => { if (!isNavbar) e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)"; }}
        >
          <Search size={isCompact ? 16 : 20} color="#94A3B8" style={{ marginLeft: "0.5rem", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
            placeholder={placeholder}
            style={{
              flex: 1,
              height: "100%",
              padding: `0 ${isCompact ? "0.5rem" : "0.75rem"}`,
              fontSize: isCompact ? "13px" : isNavbar ? "13px" : "16px",
              color: "#0F172A",
              background: "transparent",
              border: "none",
              outline: "none",
              minWidth: 0,
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setSuggestions([]); setOpen(false); inputRef.current?.focus(); }}
              style={{ width: isCompact ? 28 : 32, height: isCompact ? 28 : 32, borderRadius: "50%", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#94A3B8" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F1F5F9")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <X size={isCompact ? 14 : 16} />
            </button>
          )}
          {!isNavbar && (
            <button
              type="submit"
              style={{
                height: isCompact ? 32 : 48,
                padding: `0 ${isCompact ? "0.75rem" : "1.5rem"}`,
                borderRadius: isCompact ? 8 : 14,
                background: "#F97316",
                color: "white",
                border: "none",
                fontSize: isCompact ? "12px" : "15px",
                fontWeight: 600,
                cursor: "pointer",
                flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#EA580C")}
              onMouseLeave={e => (e.currentTarget.style.background = "#F97316")}
            >
              {isCompact ? "OK" : "Chercher"}
            </button>
          )}
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            background: "white",
            borderRadius: 14,
            boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
            border: "1px solid #E2E8F0",
            padding: "0.375rem",
            zIndex: 300,
            animation: "fadeIn 150ms ease",
          }}
        >
          {suggestions.map((s, i) => (
            <button
              key={`${s.type}-${s.id}-${i}`}
              type="button"
              onClick={() => handleSuggestionClick(s)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                padding: "0.625rem 0.75rem",
                borderRadius: 10,
                fontSize: "14px",
                color: "#0F172A",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#F8FAFC")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: s.type === "dish" ? "#FFF7ED" : s.type === "cook" ? "#F0FDF4" : "#EFF6FF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", flexShrink: 0,
              }}>
                {s.type === "dish" ? "🍽️" : s.type === "cook" ? "👨‍🍳" : "📂"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.text}</div>
                <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: 1 }}>{s.subtitle}</div>
              </div>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.type}</span>
            </button>
          ))}
        </div>
      )}

      {loading && query.length >= 2 && (
        <div style={{ position: "absolute", right: isNavbar ? 12 : 80, top: "50%", transform: "translateY(-50%)" }}>
          <Loader2 size={14} color="#94A3B8" style={{ animation: "spin 500ms linear infinite" }} />
        </div>
      )}
    </div>
  );
}
