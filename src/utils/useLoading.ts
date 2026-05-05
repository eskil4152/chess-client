"use client";

import { useCallback, useEffect, useState } from "react";

interface UseLoadingResult<T> {
  loading: boolean;
  error?: unknown;
  response?: T;
  reload: () => Promise<void>;
}

export default function useLoading<T>(
  loadingFunction: () => Promise<T>,
): UseLoadingResult<T> {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const [response, setResponse] = useState<T>();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setResponse(await loadingFunction());
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [loadingFunction]);

  useEffect(() => {
    void load();
  }, [load]);

  return { loading, error, response, reload: load };
}