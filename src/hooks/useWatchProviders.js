import { useState, useEffect } from "react";
import { fetchWatchProviders } from "../lib/tmdb";

const useWatchProviders = (movieId) => {
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!movieId) {
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const loadProviders = async () => {
      setLoading(true);
      const data = await fetchWatchProviders(movieId);
      
      if (!isCancelled) {
        setProviders(data);
        setLoading(false);
      }
    };

    loadProviders();

    return () => {
      isCancelled = true;
    };
  }, [movieId]);

  const streamingProviders = providers?.flatrate || [];
  const rentProviders = providers?.rent || [];
  const buyProviders = providers?.buy || [];

  return {
    providers,
    streamingProviders,
    rentProviders,
    buyProviders,
    loading,
    hasStreaming: streamingProviders.length > 0,
  };
};

export default useWatchProviders;

