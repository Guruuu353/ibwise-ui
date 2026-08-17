import { useEffect, useState } from "react";
import { api } from "../lib/api";

// Fetches from the real API; if it's unreachable (backend not deployed yet,
// or offline demo mode) falls back to the provided mock so every page keeps
// working standalone. Once the backend is live, this becomes a normal fetch
// hook with no component changes needed.
export function useApiData(path, mockFallback, deps = []) {
  const [data, setData] = useState(mockFallback);
  const [loading, setLoading] = useState(true);
  const [isMock, setIsMock] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get(path)
      .then((res) => { if (!cancelled) { setData(res); setIsMock(false); } })
      .catch(() => { if (!cancelled) { setData(mockFallback); setIsMock(true); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, isMock };
}
