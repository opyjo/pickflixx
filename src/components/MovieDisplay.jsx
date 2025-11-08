import React, { useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import MovieDisplayCard from "./MovieDisplayCard";
import { Film, TrendingUp, Play, Trash2, Filter, X, ChevronDown, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import MovieFilters from "./MovieFilters";
import useMovieGenres from "../hooks/useMovieGenres";
import useDebouncedValue from "../hooks/useDebouncedValue";
import { TMDB_API_BASE_URL, TMDB_API_KEY, buildPosterUrl } from "../lib/tmdb";
import { MOVIE_FILTER_DEFAULTS } from "../constants/movieFilters";
import { GlobalContext } from "../context/GlobalState";
import { Badge } from "./ui/badge";

const formatTimeLabel = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }
  const roundedSeconds = Math.floor(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const ContinueWatchingCard = ({ entry, onResume, onDismiss }) => {
  const navigate = useNavigate();

  if (!entry?.movie) {
    return null;
  }

  const { movie, timestamp, duration } = entry;
  const posterUrl =
    buildPosterUrl(movie.backdrop_path, "w780") ??
    buildPosterUrl(movie.poster_path, "w500");

  const progressPercent =
    duration > 0 ? Math.min(100, (timestamp / duration) * 100) : 0;

  const handleResume = () => {
    onResume(movie);
    navigate("/summary");
  };

  const handleDismiss = (event) => {
    event.stopPropagation();
    onDismiss(movie.id);
  };

  return (
    <Card className="overflow-hidden border-border/60 bg-card/70 backdrop-blur transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title ?? movie.original_title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            No artwork
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <CardTitle className="absolute bottom-4 left-4 right-16 text-lg font-semibold text-white drop-shadow">
          {movie.title ?? movie.original_title}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          aria-label="Remove from continue watching"
          className="absolute right-3 top-3 bg-black/50 text-white hover:bg-black/70"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-primary"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="text-xs text-muted-foreground">
          Resume from {formatTimeLabel(timestamp)} •{" "}
          {Math.round(progressPercent)}%
        </div>
        <Button size="sm" onClick={handleResume} className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Resume
        </Button>
      </CardContent>
    </Card>
  );
};

const MovieDisplay = ({ onMovieSelect }) => {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(MOVIE_FILTER_DEFAULTS);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const debouncedFilters = useDebouncedValue(filters, 400);
  const { genres } = useMovieGenres();
  const { resumeProgress, clearResumeProgress } = useContext(GlobalContext);

  useEffect(() => {
    let isCancelled = false;

    const fetchMovies = async () => {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      try {
        const params = {
          sort_by: "primary_release_date.desc",
          api_key: TMDB_API_KEY,
          "primary_release_date.gte": `${debouncedFilters.yearRange[0]}-01-01`,
          "primary_release_date.lte": `${debouncedFilters.yearRange[1]}-12-31`,
          page: 1,
          "vote_count.gte": 20,
        };

        if (debouncedFilters.genres.length > 0) {
          params.with_genres = debouncedFilters.genres.join(",");
        }

        if (debouncedFilters.rating > 0) {
          params["vote_average.gte"] = debouncedFilters.rating;
        }

        if (debouncedFilters.streamingServices?.length > 0) {
          params.with_watch_providers = debouncedFilters.streamingServices.join("|");
          params.watch_region = "US";
        }

        const response = await axios.get(`${TMDB_API_BASE_URL}/discover/movie`, {
          params,
        });

        if (!isCancelled) {
          setMovieList(response.data.results ?? []);
          setTotalPages(response.data.total_pages ?? 1);
          setTotalResults(response.data.total_results ?? 0);
        }
      } catch (fetchError) {
        if (!isCancelled) {
          setError(
            fetchError?.response?.data?.status_message ??
              fetchError?.message ??
              "Unable to load movies."
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchMovies();

    return () => {
      isCancelled = true;
    };
  }, [debouncedFilters]);

  const handleFiltersChange = (updatedFilters) => {
    setFilters(updatedFilters);
  };

  const handleResetFilters = () => {
    setFilters({ ...MOVIE_FILTER_DEFAULTS });
  };

  const handleLoadMore = async () => {
    if (loadingMore || currentPage >= totalPages) {
      return;
    }

    setLoadingMore(true);
    setError(null);

    try {
      const nextPage = currentPage + 1;
      const params = {
        sort_by: "primary_release_date.desc",
        api_key: TMDB_API_KEY,
        "primary_release_date.gte": `${debouncedFilters.yearRange[0]}-01-01`,
        "primary_release_date.lte": `${debouncedFilters.yearRange[1]}-12-31`,
        page: nextPage,
        "vote_count.gte": 20,
      };

      if (debouncedFilters.genres.length > 0) {
        params.with_genres = debouncedFilters.genres.join(",");
      }

      if (debouncedFilters.rating > 0) {
        params["vote_average.gte"] = debouncedFilters.rating;
      }

      if (debouncedFilters.streamingServices?.length > 0) {
        params.with_watch_providers = debouncedFilters.streamingServices.join("|");
        params.watch_region = "US";
      }

      const response = await axios.get(`${TMDB_API_BASE_URL}/discover/movie`, {
        params,
      });

      setMovieList((prevList) => [...prevList, ...(response.data.results ?? [])]);
      setCurrentPage(nextPage);
    } catch (fetchError) {
      setError(
        fetchError?.response?.data?.status_message ??
          fetchError?.message ??
          "Unable to load more movies."
      );
    } finally {
      setLoadingMore(false);
    }
  };

  const continueWatchingEntries = useMemo(() => {
    const entries = Object.values(resumeProgress ?? {}).filter(
      (entry) => entry?.movie && entry.timestamp > 0
    );

    return entries.sort((a, b) => {
      const dateA = new Date(a.updatedAt ?? 0).getTime();
      const dateB = new Date(b.updatedAt ?? 0).getTime();
      return dateB - dateA;
    });
  }, [resumeProgress]);

  const handleResumeFromCard = (movie) => {
    onMovieSelect(movie);
  };

  const renderedList = useMemo(
    () =>
      movieList
        .filter((movie) => movie.poster_path !== null)
        .map((movie) => (
          <MovieDisplayCard
            onMovieSelect={onMovieSelect}
            key={movie.id}
            movie={movie}
          />
        )),
    [movieList, onMovieSelect]
  );

  const isEmptyState = !loading && !error && renderedList.length === 0;

  const hasActiveFilters =
    filters.genres.length > 0 || 
    filters.rating > 0 || 
    (filters.streamingServices?.length > 0);

  const activeFiltersCount =
    filters.genres.length + 
    (filters.rating > 0 ? 1 : 0) + 
    (filters.streamingServices?.length || 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <Film className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Latest Movies</h1>
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Discover the newest movies recently released</span>
          {!loading && totalResults > 0 && (
            <>
              <span>•</span>
              <span className="font-medium">
                Showing {movieList.filter((m) => m.poster_path).length} of {totalResults.toLocaleString()}+ movies
              </span>
            </>
          )}
        </div>
      </div>

      {continueWatchingEntries.length > 0 && (
        <div className="mb-12 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Continue Watching</h2>
            <p className="text-sm text-muted-foreground">
              Pick up where you left off.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {continueWatchingEntries.map((entry) => (
              <ContinueWatchingCard
                key={`${entry.movie.id}-${entry.updatedAt}`}
                entry={entry}
                onResume={handleResumeFromCard}
                onDismiss={clearResumeProgress}
              />
            ))}
          </div>
        </div>
      )}

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
          hideYearFilter={true}
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
              className="h-[450px] rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : isEmptyState ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
          <Film className="h-16 w-16" />
          <p>No movies match your filters. Try adjusting them.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {renderedList}
          </div>

          {/* Load More Button */}
          {currentPage < totalPages && !loading && (
            <div className="mt-12 flex flex-col items-center gap-4">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                size="lg"
                variant="outline"
                className="group min-w-[200px] border-2 hover:border-primary hover:bg-primary/5"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-5 w-5 transition-transform group-hover:translate-y-1" />
                    Load More Movies
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages} • {totalResults.toLocaleString()} total results
              </p>
            </div>
          )}

          {/* All Loaded Message */}
          {currentPage >= totalPages && movieList.length > 0 && (
            <div className="mt-12 flex flex-col items-center gap-2 text-center">
              <div className="rounded-full bg-muted p-3">
                <Film className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                You've reached the end!
              </p>
              <p className="text-xs text-muted-foreground">
                All {movieList.filter((m) => m.poster_path).length} movies loaded
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MovieDisplay;
