export const TMDB_API_KEY = "cdec2f2873bb826dad1cc5da665e4326";
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

export const buildPosterUrl = (path, size = "w500") => {
  if (!path) {
    return null;
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

