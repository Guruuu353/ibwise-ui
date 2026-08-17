import { useEffect, useRef, useState, useCallback } from "react";
import { api } from "../lib/api";

// Simple interval-poll for chat — swap for Socket.io later without touching
// the calling components (they just read {data, refresh}).
export function usePolling(path, { intervalMs = 4000, mock = [] } = {}) {
  const [data, setData] = useState(mock);
  const [isMock, setIsMock] = useState(false);
  const timer = useRef(null);

  const fetchOnce = useCallback(async () => {
    try {
      const res = await api.get(path);
      setData(res);
      setIsMock(false);
    } catch {
      setData(mock);
      setIsMock(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    fetchOnce();
    timer.current = setInterval(fetchOnce, intervalMs);
    return () => clearInterval(timer.current);
  }, [fetchOnce, intervalMs]);

  return { data, isMock, refresh: fetchOnce };
}
