"use client";

import { ChevronDown } from "lucide-react";

interface SortOption {
  value: string;
  label: string;
}

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
  options?: SortOption[];
}

const DEFAULT_OPTIONS: SortOption[] = [
  { value: "newest", label: "Plus récents" },
  { value: "popular", label: "Les plus populaires" },
  { value: "rating", label: "Mieux notés" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

export default function SortSelect({ value, onChange, options = DEFAULT_OPTIONS }: SortSelectProps) {
  return (
    <div style={{ position: "relative" }}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          height: 36,
          padding: "0 2rem 0 0.875rem",
          borderRadius: 10,
          border: "1.5px solid #E2E8F0",
          background: "white",
          fontSize: "13px",
          fontWeight: 500,
          color: "#475569",
          cursor: "pointer",
          appearance: "none",
          outline: "none",
        }}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={13} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#94A3B8" }} />
    </div>
  );
}
