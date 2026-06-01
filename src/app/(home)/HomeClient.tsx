"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";

export default function HomeClient({ cities }: { cities: string[] }) {
  const router = useRouter();
  const [activeCity, setActiveCity] = useState("Alger");

  return (
    <div>
      <SearchBar variant="hero" placeholder="Chercher un couscous, un tajine, un cuisinier…" />

      {/* City Chips */}
      <div style={{ display: "flex", justifyContent: "center", gap: "0.625rem", flexWrap: "wrap" }}>
        {cities.map(city => (
          <button
            key={city}
            onClick={() => {
              setActiveCity(city);
              router.push(`/dishes?city=${city}`);
            }}
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
