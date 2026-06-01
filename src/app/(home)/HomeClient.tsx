"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, MapPin } from "lucide-react";
import SearchBar from "@/components/search/SearchBar";

export default function HomeClient({ cities }: { cities: string[] }) {
  const router = useRouter();
  const [activeCity, setActiveCity] = useState("Alger");

  function pickCity(city: string) {
    setActiveCity(city);
    router.push(`/dishes?city=${encodeURIComponent(city)}`);
  }

  return (
    <div>
      <SearchBar variant="hero" placeholder="Chercher un couscous, un tajine, un cuisinier…" />

      <div style={{ position: "relative", maxWidth: 360, margin: "0 auto" }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <MapPin size={15} color="#F97316" />
        </div>
        <select
          value={activeCity}
          onChange={e => pickCity(e.target.value)}
          style={{
            width: "100%", height: 44, padding: "0 2.5rem 0 2.25rem",
            borderRadius: 9999, background: "white",
            border: "1.5px solid #E2E8F0",
            fontSize: "14px", fontWeight: 600, color: "#0F172A",
            cursor: "pointer", appearance: "none", outline: "none",
            boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
            transition: "border-color 150ms",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#F97316")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "#E2E8F0")}
        >
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <ChevronDown size={15} color="#94A3B8" style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
}
