"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SearchBar from "@/components/search/SearchBar";
import FilterDrawer from "@/components/search/FilterDrawer";
import SortSelect from "@/components/search/SortSelect";

export default function DishesSearchControls() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters = {
    category: searchParams.get("category") || "",
    city: searchParams.get("city") || "",
    wilaya: searchParams.get("wilaya") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minRating: searchParams.get("minRating") || "",
    isAvailable: searchParams.get("isAvailable") !== "false",
  };

  const sortBy = searchParams.get("sortBy") || "newest";

  function applyFilters(key: string, value: string | boolean) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "" || value === false) {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
    params.set("page", "1");
    router.push(`/dishes?${params.toString()}`);
  }

  return (
    <div style={{ display: "flex", gap: "0.625rem", alignItems: "center", flexWrap: "wrap" }}>
      <div style={{ flex: 1, minWidth: 200, maxWidth: 460 }}>
        <SearchBar variant="compact" />
      </div>
      <FilterDrawer
        filters={filters}
        onChange={(key, value) => applyFilters(key, value)}
        onReset={() => router.push("/dishes")}
      />
      <SortSelect
        value={sortBy}
        onChange={v => applyFilters("sortBy", v)}
      />
    </div>
  );
}
