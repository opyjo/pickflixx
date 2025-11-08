import axios from "axios";

export const TMDB_API_KEY = process.env.REACT_APP_TMDB_API_KEY;
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

export const buildPosterUrl = (path, size = "w500") => {
  if (!path) {
    return null;
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

export const fetchWatchProviders = async (movieId) => {
  try {
    const response = await axios.get(
      `${TMDB_API_BASE_URL}/movie/${movieId}/watch/providers`,
      {
        params: {
          api_key: TMDB_API_KEY,
        },
      }
    );
    
    // Return US providers (can be changed to other regions)
    return response.data.results?.US || null;
  } catch (error) {
    console.error("Error fetching watch providers:", error);
    return null;
  }
};

// Popular streaming services with their TMDB provider IDs
export const STREAMING_SERVICES = {
  8: { name: "Netflix", logo: "🅽", color: "bg-red-600" },
  9: { name: "Amazon Prime Video", logo: "🄿", color: "bg-blue-500" },
  337: { name: "Disney+", logo: "🅳", color: "bg-blue-700" },
  384: { name: "HBO Max", logo: "🅷", color: "bg-purple-700" },
  15: { name: "Hulu", logo: "🅷", color: "bg-green-500" },
  350: { name: "Apple TV+", logo: "🄰", color: "bg-gray-800" },
  531: { name: "Paramount+", logo: "🄿", color: "bg-blue-600" },
  387: { name: "Peacock", logo: "🅿", color: "bg-yellow-500" },
  386: { name: "Peacock Premium", logo: "🅿", color: "bg-yellow-600" },
  283: { name: "Crunchyroll", logo: "🄲", color: "bg-orange-500" },
  1899: { name: "Max", logo: "🅼", color: "bg-purple-600" },
};

