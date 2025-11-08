const currentYear = new Date().getFullYear();

export const MOVIE_FILTER_DEFAULTS = {
  genres: [],
  yearRange: [2020, currentYear],
  rating: 0,
  streamingServices: [],
};

export const POPULAR_STREAMING_SERVICES = [
  { id: 8, name: "Netflix", shortName: "Netflix" },
  { id: 9, name: "Amazon Prime Video", shortName: "Prime" },
  { id: 337, name: "Disney+", shortName: "Disney+" },
  { id: 384, name: "HBO Max", shortName: "HBO Max" },
  { id: 1899, name: "Max", shortName: "Max" },
  { id: 15, name: "Hulu", shortName: "Hulu" },
  { id: 350, name: "Apple TV+", shortName: "Apple TV+" },
  { id: 531, name: "Paramount+", shortName: "Paramount+" },
  { id: 387, name: "Peacock", shortName: "Peacock" },
];

