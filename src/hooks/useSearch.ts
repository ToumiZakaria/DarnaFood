import { useState, useCallback } from "react";

export function useSearch<T>({ endpoint }: { endpoint: string }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${endpoint}?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setResults(data.results ?? data);
      } catch {
        setError("Search failed");
      } finally {
        setLoading(false);
      }
    },
    [endpoint]
  );

  return { query, setQuery, results, loading, error, search };
}
