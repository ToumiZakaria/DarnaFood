"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function HomeClient({ cities }: { cities: string[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCity, setActiveCity] = useState("Alger");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (activeCity) params.set("city", activeCity);
    router.push(`/dishes?${params.toString()}`);
  }

  return (
    <div>
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        style={{
          maxWidth: 640,
          margin: "0 auto 1.5rem",
          background: "white",
          borderRadius: 20,
          boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
          height: 64,
          display: "flex",
          alignItems: "center",
          padding: "0 0.5rem",
          transition: "box-shadow 300ms",
          border: "1px solid #F1F5F9",
        }}
        onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)")}
        onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)")}
      >
        <Search size={20} color="#94A3B8" style={{ marginLeft: "0.75rem", flexShrink: 0 }} />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Chercher un couscous, un tajine, un cuisinier…"
          style={{
            flex: 1,
            height: "100%",
            padding: "0 1rem",
            fontSize: "16px",
            color: "#0F172A",
            background: "transparent",
            border: "none",
            outline: "none",
          }}
        />
        <button
          type="submit"
          style={{
            height: 48,
            padding: "0 1.5rem",
            borderRadius: 14,
            background: "#F97316",
            color: "white",
            border: "none",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
            transition: "background 150ms",
            flexShrink: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#EA580C")}
          onMouseLeave={e => (e.currentTarget.style.background = "#F97316")}
        >
          Chercher
        </button>
      </form>

      {/* City Chips */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.625rem", flexWrap: "wrap" }}>
        {cities.map(city => (
          <button
            key={city}
            onClick={() => setActiveCity(city)}
            style={{
              height: 40,
              padding: "0 1.25rem",
              borderRadius: 9999,
              border: "1.5px solid",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 200ms",
              background: activeCity === city ? "#F97316" : "white",
              color: activeCity === city ? "white" : "#475569",
              borderColor: activeCity === city ? "#F97316" : "#E2E8F0",
              boxShadow: activeCity === city ? "0 2px 8px rgba(249,115,22,0.3)" : "none",
            }}
            onMouseEnter={e => {
              if (activeCity !== city) {
                e.currentTarget.style.borderColor = "#FBBF24";
                e.currentTarget.style.color = "#F97316";
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(249,115,22,0.1)";
              }
            }}
            onMouseLeave={e => {
              if (activeCity !== city) {
                e.currentTarget.style.borderColor = "#E2E8F0";
                e.currentTarget.style.color = "#475569";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            {city}
          </button>
        ))}
        <button
          style={{ height: 40, padding: "0 1.25rem", borderRadius: 9999, border: "1.5px solid #E2E8F0", fontSize: "14px", fontWeight: 600, cursor: "pointer", background: "white", color: "#94A3B8" }}
        >
          + Plus
        </button>
      </div>
    </div>
  );
}
