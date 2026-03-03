import { useEffect, useState } from "react";
import { getLatestResults } from "../services/api";

export function useLatestResults(token: string | null) {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!token) {
      setResults([]);
      setLoading(false);
      return;
    }

    async function fetchResults() {
      try {
        const data = await getLatestResults(token);
        if (mounted) setResults(Array.isArray(data) ? data : []);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchResults();
    const id = setInterval(fetchResults, 8000); // refresh every 8 s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [token]);

  return { results, loading };
}
