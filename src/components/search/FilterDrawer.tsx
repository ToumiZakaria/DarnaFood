"use client";

import { useState, useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";

export interface FilterState {
  category: string;
  city: string;
  wilaya: string;
  minPrice: string;
  maxPrice: string;
  minRating: string;
  isAvailable: boolean;
}

interface FilterDrawerProps {
  filters: FilterState;
  onChange: (key: string, value: string | boolean) => void;
  onReset: () => void;
}

export default function FilterDrawer({ filters, onChange, onReset }: FilterDrawerProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<{ name: string; slug: string; count: number }[]>([]);
  const [wilayas, setWilayas] = useState<{ name: string; count: number }[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });

  useEffect(() => {
    fetch("/api/search/filters")
      .then(res => res.json())
      .then(data => {
        setCategories(data.categories ?? []);
        setWilayas(data.wilayas ?? []);
        if (data.priceRange) setPriceRange(data.priceRange);
      })
      .catch(() => {});
  }, []);

  function update(key: keyof FilterState, value: string | boolean) {
    onChange(key, value);
  }

  const activeCount = [filters.category, filters.city, filters.wilaya, filters.minPrice, filters.maxPrice, filters.minRating]
    .filter(v => v && v !== "all" && v !== "").length;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          height: 36, padding: "0 0.875rem", borderRadius: 10,
          border: "1.5px solid #E2E8F0", background: "white",
          fontSize: "13px", fontWeight: 500, color: "#475569",
          cursor: "pointer", display: "flex", alignItems: "center", gap: "0.375rem",
          position: "relative",
        }}
      >
        <SlidersHorizontal size={14} />
        Filtres
        {activeCount > 0 && (
          <span style={{
            width: 18, height: 18, borderRadius: "50%", background: "#F97316",
            color: "white", fontSize: "10px", fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, animation: "fadeIn 150ms ease" }}
          />

          <div style={{
            position: "fixed", top: 0, right: 0, bottom: 0, width: "min(400px, 85vw)",
            background: "white", zIndex: 201, padding: "1.5rem",
            boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
            display: "flex", flexDirection: "column",
            animation: "slideInRight 200ms ease",
            overflowY: "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A" }}>Filtres</h3>
              <button onClick={() => setOpen(false)} style={{ width: 36, height: 36, borderRadius: 10, border: "none", background: "#F1F5F9", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569" }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {/* Category */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>Catégorie</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {categories.map(c => (
                    <button
                      key={c.slug}
                      onClick={() => update("category", filters.category === c.slug ? "" : c.slug)}
                      style={{
                        padding: "0.375rem 0.75rem", borderRadius: 8, border: "1.5px solid",
                        fontSize: "12px", fontWeight: 600, cursor: "pointer",
                        background: filters.category === c.slug ? "#F97316" : "white",
                        color: filters.category === c.slug ? "white" : "#475569",
                        borderColor: filters.category === c.slug ? "#F97316" : "#E2E8F0",
                      }}
                    >
                      {c.name} ({c.count})
                    </button>
                  ))}
                </div>
              </div>

              {/* Wilaya */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>Wilaya</label>
                <div style={{ display: "flex", flexDirection: "column", border: "1.5px solid #E2E8F0", borderRadius: 10, overflow: "hidden", maxHeight: 220 }}>
                  <button
                    onClick={() => update("wilaya", "")}
                    style={{
                      padding: "0.5rem 0.75rem", border: "none", cursor: "pointer",
                      background: filters.wilaya === "" ? "#FFF7ED" : "white",
                      color: filters.wilaya === "" ? "#F97316" : "#475569",
                      fontWeight: filters.wilaya === "" ? 700 : 500,
                      fontSize: "13px", textAlign: "left",
                      borderBottom: "1px solid #F1F5F9",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      transition: "all 150ms",
                    }}
                    onMouseEnter={e => { if (filters.wilaya !== "") e.currentTarget.style.background = "#F8FAFC"; }}
                    onMouseLeave={e => { if (filters.wilaya !== "") e.currentTarget.style.background = "white"; }}
                  >
                    <span>Toutes les wilayas</span>
                  </button>
                  <div style={{ overflowY: "auto", maxHeight: 180 }} className="scrollbar-thin">
                    {wilayas.map(w => (
                      <button
                        key={w.name}
                        onClick={() => update("wilaya", filters.wilaya === w.name ? "" : w.name)}
                        style={{
                          width: "100%",
                          padding: "0.5rem 0.75rem",
                          border: "none",
                          borderBottom: "1px solid #F1F5F9",
                          cursor: "pointer",
                          background: filters.wilaya === w.name ? "#FFF7ED" : "white",
                          color: filters.wilaya === w.name ? "#F97316" : "#475569",
                          fontWeight: filters.wilaya === w.name ? 700 : 500,
                          fontSize: "13px",
                          textAlign: "left",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          transition: "background 150ms",
                        }}
                        onMouseEnter={e => { if (filters.wilaya !== w.name) e.currentTarget.style.background = "#F8FAFC"; }}
                        onMouseLeave={e => { if (filters.wilaya !== w.name) e.currentTarget.style.background = "white"; }}
                      >
                        <span>{w.name}</span>
                        <span style={{ fontSize: "11px", color: "#94A3B8", background: "#F1F5F9", padding: "1px 7px", borderRadius: 9999, fontWeight: 600 }}>{w.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>Prix</label>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={e => update("minPrice", e.target.value)}
                    style={{ flex: 1, height: 44, borderRadius: 10, border: "1.5px solid #E2E8F0", padding: "0 0.75rem", fontSize: "14px", color: "#0F172A" }}
                  />
                  <span style={{ color: "#94A3B8", fontSize: "14px" }}>—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={e => update("maxPrice", e.target.value)}
                    style={{ flex: 1, height: 44, borderRadius: 10, border: "1.5px solid #E2E8F0", padding: "0 0.75rem", fontSize: "14px", color: "#0F172A" }}
                  />
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <label style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem", display: "block", textTransform: "uppercase", letterSpacing: "0.05em" }}>Note minimum</label>
                <div style={{ display: "flex", gap: "0.375rem" }}>
                  {[3, 3.5, 4, 4.5].map(r => (
                    <button
                      key={r}
                      onClick={() => update("minRating", filters.minRating === String(r) ? "" : String(r))}
                      style={{
                        flex: 1, height: 36, borderRadius: 8, border: "1.5px solid",
                        fontSize: "13px", fontWeight: 600, cursor: "pointer",
                        background: filters.minRating === String(r) ? "#F97316" : "white",
                        color: filters.minRating === String(r) ? "white" : "#475569",
                        borderColor: filters.minRating === String(r) ? "#F97316" : "#E2E8F0",
                      }}
                    >
                      {r}+
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "14px", fontWeight: 600, color: "#0F172A" }}>
                  <input
                    type="checkbox"
                    checked={filters.isAvailable}
                    onChange={e => update("isAvailable", e.target.checked)}
                    style={{ width: 18, height: 18, accentColor: "#F97316", cursor: "pointer" }}
                  />
                  Disponible uniquement
                </label>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid #F1F5F9" }}>
              <button onClick={() => { onReset(); setOpen(false); }} style={{ flex: 1, height: 44, borderRadius: 12, border: "1.5px solid #E2E8F0", background: "white", fontSize: "14px", fontWeight: 600, color: "#475569", cursor: "pointer" }}>
                Réinitialiser
              </button>
              <button onClick={() => setOpen(false)} style={{ flex: 1, height: 44, borderRadius: 12, background: "#F97316", color: "white", border: "none", fontSize: "14px", fontWeight: 600, cursor: "pointer" }}>
                Voir les résultats
              </button>
            </div>
          </div>
        </>
      )}

      <style>{`
        .scrollbar-thin { scrollbar-width: thin; scrollbar-color: #CBD5E1 transparent; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 3px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94A3B8; }
      `}</style>
    </>
  );
}
