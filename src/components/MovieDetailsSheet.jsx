import React, {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { GlobalContext } from "../context/GlobalState";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Calendar, Clock, Users, Play, X } from "lucide-react";
import { buildPosterUrl } from "../lib/tmdb";

const MovieDetailsSheet = ({ onWatchTrailer }) => {
  const {
    selectedMovieDetails,
    selectedMovieStatus,
    selectedMovieError,
    selectedMovieId,
    fetchMovieDetails,
    closeMovieDetails,
  } = useContext(GlobalContext);
  const navigate = useNavigate();

  const isOpen =
    selectedMovieStatus !== "idle" || Boolean(selectedMovieDetails);

  const isLoading = selectedMovieStatus === "loading";
  const hasError = selectedMovieStatus === "error";
  const movie = selectedMovieDetails;

  const trailerKey = useMemo(() => {
    if (!movie?.videos?.results) {
      return null;
    }
    const video = movie.videos.results.find(
      (entry) =>
        entry.site === "YouTube" &&
        (entry.type === "Trailer" || entry.type === "Teaser")
    );
    return video?.key ?? null;
  }, [movie?.videos?.results]);

  const topCast = useMemo(() => {
    if (!movie?.credits?.cast) {
      return [];
    }
    return movie.credits.cast.slice(0, 6);
  }, [movie?.credits?.cast]);

  const handleRetry = () => {
    if (selectedMovieId) {
      fetchMovieDetails(selectedMovieId);
    }
  };

  const handleWatchTrailer = () => {
    if (!movie) {
      return;
    }
    if (onWatchTrailer) {
      onWatchTrailer(movie);
    }
    closeMovieDetails();
    navigate("/summary");
  };

  const runtimeLabel = movie?.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  const releaseYear = movie?.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const portalRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const node = document.createElement("div");
    portalRef.current = node;
    document.body.appendChild(node);
    setMounted(true);
    return () => {
      if (portalRef.current) {
        document.body.removeChild(portalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeMovieDetails();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeMovieDetails]);

  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      closeMovieDetails();
    }
  };

  if (!isOpen || !mounted || !portalRef.current) {
    return null;
  }

  const content = (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onMouseDown={handleOverlayClick}
      />
      <div className="relative ml-auto flex h-full w-full max-w-2xl flex-col bg-background shadow-xl">
        <button
          type="button"
          className="absolute right-4 top-4 z-10 rounded-full bg-background/95 p-3 shadow-lg text-foreground transition hover:bg-accent hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={closeMovieDetails}
          aria-label="Close details"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative h-60 w-full overflow-hidden bg-muted">
          {isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : movie?.backdrop_path || movie?.poster_path ? (
            <img
              src={
                buildPosterUrl(movie.backdrop_path, "w780") ??
                buildPosterUrl(movie.poster_path, "w500")
              }
              alt={movie?.original_title ?? "Movie poster"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No preview available
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="space-y-3 mb-6">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : hasError ? (
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-semibold">Something went wrong</h2>
              <p className="text-sm text-muted-foreground">
                {selectedMovieError}
              </p>
              <div>
                <Button onClick={handleRetry} variant="outline" size="sm">
                  Try again
                </Button>
              </div>
            </div>
          ) : movie ? (
            <>
              <div className="mb-6 space-y-3">
                <h2 className="text-2xl font-bold">
                  {movie.original_title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  {releaseYear && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {releaseYear}
                    </span>
                  )}
                  {runtimeLabel && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {runtimeLabel}
                    </span>
                  )}
                  {movie.vote_average ? (
                    <span className="inline-flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {movie.vote_average.toFixed(1)} / 10
                    </span>
                  ) : null}
                </div>
              </div>

              {movie.overview && (
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                  {movie.overview}
                </p>
              )}

              {movie.genres?.length ? (
                <div className="mb-6 space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Genres
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}

              {topCast.length ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Top cast
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {topCast.map((person) => (
                      <div
                        key={person.cast_id ?? person.credit_id ?? person.id}
                        className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 text-sm"
                      >
                        <p className="font-medium">{person.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {person.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 border-t border-border/60 bg-background/95 p-4 sm:flex-row">
          <Button
            className="flex-1"
            onClick={handleWatchTrailer}
            disabled={!movie}
          >
            <Play className="mr-2 h-4 w-4" />
            Watch trailer
          </Button>
          {trailerKey && (
            <Button
              variant="outline"
              className="hidden sm:flex"
              onClick={() => {
                if (!trailerKey) {
                  return;
                }
                if (typeof window !== "undefined") {
                  window.open(
                    `https://www.youtube.com/watch?v=${trailerKey}`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }
              }}
            >
              Open in YouTube
            </Button>
          )}
          <Button
            variant="outline"
            onClick={closeMovieDetails}
            className="sm:hidden"
          >
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, portalRef.current);
};

MovieDetailsSheet.propTypes = {
  onWatchTrailer: PropTypes.func,
};

export default MovieDetailsSheet;

