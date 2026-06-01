"use client";

import { X } from "lucide-react";

interface ActiveFilter {
  key: string;
  label: string;
}

interface ActiveFiltersProps {
  filters: ActiveFilter[];
  onRemove: (key: string) => void;
  onClear: () => void;
}

export default function ActiveFilters({ filters, onRemove, onClear }: ActiveFiltersProps) {
  if (filters.length === 0) return null;

  return (
    <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0.75rem 1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
      {filters.map(f => (
        <span key={f.key} style={{ display: "flex", alignItems: "center", gap: "0.25rem", background: "#FFF7ED", color: "#EA580C", padding: "0.25rem 0.75rem", borderRadius: 9999, fontSize: "13px", fontWeight: 500 }}>
          {f.label} <X size={12} style={{ cursor: "pointer" }} onClick={() => onRemove(f.key)} />
        </span>
      ))}
      <button onClick={onClear} style={{ fontSize: "13px", color: "#94A3B8", background: "none", border: "none", cursor: "pointer", marginLeft: "0.25rem", padding: 0 }}>
        Effacer tout
      </button>
    </div>
  );
}
