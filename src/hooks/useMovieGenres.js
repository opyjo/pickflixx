import { useEffect, useState } from "react";
import axios from "axios";
import { TMDB_API_BASE_URL, TMDB_API_KEY } from "../lib/tmdb";

const useMovieGenres = () => {
  const [genres, setGenres] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    const fetchGenres = async () => {
      setStatus("loading");
      setError(null);

      try {
        const response = await axios.get(`${TMDB_API_BASE_URL}/genre/movie/list`, {
          params: { api_key: TMDB_API_KEY },
        });

        if (!isCancelled) {
          setGenres(response.data?.genres ?? []);
          setStatus("loaded");
        }
      } catch (fetchError) {
        if (!isCancelled) {
          setError(
            fetchError?.response?.data?.status_message ??
              fetchError?.message ??
              "Unable to load genres."
          );
          setStatus("error");
        }
      }
    };

    fetchGenres();

    return () => {
      isCancelled = true;
    };
  }, []);

  return { genres, status, error };
};

export default useMovieGenres;

