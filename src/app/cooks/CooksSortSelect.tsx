"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function CooksSortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <select
      defaultValue={searchParams.get("sortBy") || "rating"}
      onChange={e => {
        const sp = new URLSearchParams(searchParams.toString());
        sp.set("sortBy", e.target.value);
        sp.set("page", "1");
        router.push(`/cooks?${sp.toString()}`);
      }}
      style={{ height: 46, padding: "0 2.5rem 0 1rem", borderRadius: 14, border: "1.5px solid #E2E8F0", background: "white", fontSize: "14px", fontWeight: 500, color: "#475569", cursor: "pointer", appearance: "none" }}
    >
      <option value="rating">Mieux notés</option>
      <option value="orders">Plus de commandes</option>
    </select>
  );
}
