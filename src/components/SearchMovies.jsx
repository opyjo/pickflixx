import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search as SearchIcon, Filter, X } from "lucide-react";
import MovieDisplayCard from "./MovieDisplayCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import MovieFilters from "./MovieFilters";
import useMovieGenres from "../hooks/useMovieGenres";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { TMDB_API_BASE_URL, TMDB_API_KEY } from "../lib/tmdb";
import { MOVIE_FILTER_DEFAULTS } from "../constants/movieFilters";

const SearchMovies = ({ onMovieSelect }) => {
  const [term, setTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(MOVIE_FILTER_DEFAULTS);
  const [showFilters, setShowFilters] = useState(false);

  const debouncedTerm = useDebouncedValue(term, 400);
  const debouncedFilters = useDebouncedValue(filters, 400);
  const { genres } = useMovieGenres();

  useEffect(() => {
    let isCancelled = false;

    const trimmedQuery = debouncedTerm.trim();

    if (!trimmedQuery) {
      setMovies([]);
      setError(null);
      setLoading(false);
      return () => {
        isCancelled = true;
      };
    }

    const searchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${TMDB_API_BASE_URL}/search/movie`, {
          params: {
            api_key: TMDB_API_KEY,
            query: trimmedQuery,
            include_adult: false,
            page: 1,
          },
        });

        if (isCancelled) {
          return;
        }

        const results = response.data.results ?? [];

        const filteredResults = results.filter((movie) => {
          const genreIds = movie.genre_ids ?? [];
          const releaseYear = movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : null;
          const voteAverage = movie.vote_average ?? 0;

          const matchesGenres =
            debouncedFilters.genres.length === 0 ||
            debouncedFilters.genres.every((genreId) =>
              genreIds.includes(genreId)
            );

          const matchesYear =
            !releaseYear ||
            (releaseYear >= debouncedFilters.yearRange[0] &&
              releaseYear <= debouncedFilters.yearRange[1]);

          const matchesRating =
            debouncedFilters.rating <= 0 ||
            (Number.isFinite(voteAverage) &&
              voteAverage >= debouncedFilters.rating);

          return matchesGenres && matchesYear && matchesRating;
        });

        setMovies(filteredResults);
      } catch (fetchError) {
        if (!isCancelled) {
          setError(
            fetchError?.response?.data?.status_message ??
              fetchError?.message ??
              "Unable to search movies."
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    searchMovies();

    return () => {
      isCancelled = true;
    };
  }, [debouncedTerm, debouncedFilters]);

  const handleFiltersChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const handleResetFilters = () => {
    setFilters({ ...MOVIE_FILTER_DEFAULTS });
  };

  const hasActiveFilters =
    filters.genres.length > 0 ||
    filters.rating > 0 ||
    filters.yearRange[0] !== MOVIE_FILTER_DEFAULTS.yearRange[0] ||
    filters.yearRange[1] !== MOVIE_FILTER_DEFAULTS.yearRange[1];

  const activeFiltersCount =
    filters.genres.length +
    (filters.rating > 0 ? 1 : 0) +
    (filters.yearRange[0] !== MOVIE_FILTER_DEFAULTS.yearRange[0] ||
    filters.yearRange[1] !== MOVIE_FILTER_DEFAULTS.yearRange[1]
      ? 1
      : 0);

  const renderedList = useMemo(
    () =>
      movies
        .filter((movie) => movie.poster_path !== null)
        .map((movie) => (
          <MovieDisplayCard
            onMovieSelect={onMovieSelect}
            key={movie.id}
            movie={movie}
          />
        )),
    [movies, onMovieSelect]
  );

  const showEmptyState =
    !loading && debouncedTerm.trim() && renderedList.length === 0;

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <SearchIcon className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Search Movies</h1>
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            {showFilters ? (
              <>
                <X className="h-4 w-4" />
                Hide Filters
              </>
            ) : (
              <>
                <Filter className="h-4 w-4" />
                Show Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5">
                    {activeFiltersCount}
                  </Badge>
                )}
              </>
            )}
          </Button>
        </div>
        <p className="text-muted-foreground">
          Find movies by title, then refine with filters
        </p>
      </div>

      <div className="relative mb-6 max-w-2xl">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          type="text"
          placeholder="Search for a movie..."
          className="h-12 pl-10 text-base"
        />
      </div>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          showFilters ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <MovieFilters
          genres={genres}
          filters={filters}
          defaultFilters={MOVIE_FILTER_DEFAULTS}
          onChange={handleFiltersChange}
          onReset={handleResetFilters}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="h-[450px] animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : showEmptyState ? (
        <div className="py-16 text-center text-muted-foreground">
          No movies found. Try a different search term or adjust your filters.
        </div>
      ) : renderedList.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {renderedList}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
          <SearchIcon className="h-16 w-16" />
          <p>Start typing to search for movies</p>
        </div>
      )}
    </div>
  );
};

export default SearchMovies;

