import { useEffect, useState } from "react";
import { getHistory } from "../services/api";

type Summary = {
  count: number;
  totalRebate: number;
  loading: boolean;
};

export function useHistorySummary(token: string | null, refreshMs = 15000): Summary {
  const [count, setCount] = useState(0);
  const [totalRebate, setTotalRebate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!token) {
      setCount(0);
      setTotalRebate(0);
      setLoading(false);
      return;
    }

    const fetchSummary = async () => {
      try {
        const data = await getHistory(token);
        const rows = Array.isArray(data) ? data : [];
        const sum = rows.reduce(
          (acc, item) => acc + (typeof item.rebate === "number" ? item.rebate : 0),
          0
        );
        if (mounted) {
          setCount(rows.length);
          setTotalRebate(sum);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSummary();
    const id = setInterval(fetchSummary, refreshMs);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [token, refreshMs]);

  return { count, totalRebate, loading };
}
