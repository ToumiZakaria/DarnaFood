"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin, Check, Search } from "lucide-react";
import SearchBar from "@/components/search/SearchBar";

const POPULAR_WILAYAS = ["Alger", "Oran", "Constantine", "Annaba", "Sétif", "Blida"];

export default function HomeClient({ cities }: { cities: string[] }) {
  const router = useRouter();
  const [activeCity, setActiveCity] = useState("Alger");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = query
    ? cities.filter(c => c.toLowerCase().includes(query.toLowerCase()))
    : cities;

  function pickCity(city: string) {
    setActiveCity(city);
    setOpen(false);
    setQuery("");
    router.push(`/dishes?city=${encodeURIComponent(city)}`);
  }

  return (
    <div>
      <SearchBar variant="hero" placeholder="Chercher un couscous, un tajine, un cuisinier…" />

      {/* City Picker */}
      <div ref={wrapperRef} style={{ position: "relative", maxWidth: 360, margin: "0 auto" }}>
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            width: "100%", height: 44, padding: "0 1rem",
            borderRadius: 9999, background: "white", border: "1.5px solid #E2E8F0",
            fontSize: "14px", fontWeight: 600, color: "#0F172A", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            transition: "all 150ms",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#F97316")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
        >
          <MapPin size={15} color="#F97316" />
          <span style={{ flex: 1, textAlign: "left" }}>{activeCity}</span>
          <ChevronDown size={15} color="#94A3B8" style={{ transition: "transform 200ms", transform: open ? "rotate(180deg)" : "rotate(0)" }} />
        </button>

        {open && (
          <div
            style={{
              position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0,
              background: "white", borderRadius: 16,
              boxShadow: "0 10px 40px rgba(0,0,0,0.12)", border: "1px solid #E2E8F0",
              padding: "0.5rem", zIndex: 100,
              maxHeight: 360, display: "flex", flexDirection: "column",
              animation: "fadeIn 150ms ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 0.625rem", borderRadius: 10, background: "#F8FAFC", margin: "0 0 0.25rem" }}>
              <Search size={14} color="#94A3B8" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Chercher une wilaya…"
                style={{ flex: 1, height: 32, background: "transparent", border: "none", outline: "none", fontSize: "13px", color: "#0F172A" }}
              />
            </div>

            {!query && (
              <div style={{ marginBottom: "0.25rem" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", padding: "0.375rem 0.625rem 0.25rem" }}>Populaires</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem", padding: "0 0.375rem 0.375rem" }}>
                  {POPULAR_WILAYAS.map(c => (
                    <button
                      key={c}
                      onClick={() => pickCity(c)}
                      style={{
                        padding: "0.3rem 0.625rem", borderRadius: 9999,
                        border: "1.5px solid #E2E8F0", background: "white",
                        fontSize: "12px", fontWeight: 600, color: "#475569",
                        cursor: "pointer", transition: "all 150ms",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "#F97316"; e.currentTarget.style.color = "#F97316"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#475569"; }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
                <div style={{ height: 1, background: "#F1F5F9", margin: "0 0.375rem 0.25rem" }} />
              </div>
            )}

            <div style={{ overflowY: "auto", maxHeight: 220, flexShrink: 0 }} className="scrollbar-thin">
              {filtered.length === 0 ? (
                <div style={{ padding: "1rem", textAlign: "center", fontSize: "13px", color: "#94A3B8" }}>Aucune wilaya</div>
              ) : (
                filtered.map(city => (
                  <button
                    key={city}
                    onClick={() => pickCity(city)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: "0.5rem",
                      padding: "0.5rem 0.625rem", borderRadius: 10, border: "none",
                      background: activeCity === city ? "#FFF7ED" : "transparent",
                      color: activeCity === city ? "#F97316" : "#0F172A",
                      fontSize: "13px", fontWeight: activeCity === city ? 700 : 500,
                      cursor: "pointer", textAlign: "left",
                      transition: "background 100ms",
                    }}
                    onMouseEnter={e => { if (activeCity !== city) e.currentTarget.style.background = "#F8FAFC"; }}
                    onMouseLeave={e => { if (activeCity !== city) e.currentTarget.style.background = "transparent"; }}
                  >
                    <MapPin size={13} color={activeCity === city ? "#F97316" : "#94A3B8"} />
                    <span style={{ flex: 1 }}>{city}</span>
                    {activeCity === city && <Check size={14} color="#F97316" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-thin { scrollbar-width: thin; scrollbar-color: #CBD5E1 transparent; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
