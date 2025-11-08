import React, { useContext, useState } from "react";
import MovieControls from "./MovieControls";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Star,
  Clock,
  CheckCircle2,
  FolderHeart,
  StickyNote,
  Film,
} from "lucide-react";
import PropTypes from "prop-types";
import { Button } from "./ui/button";
import { GlobalContext } from "../context/GlobalState";

const IMGPATH = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750' viewBox='0 0 500 750'%3E%3Crect fill='%23e5e7eb' width='500' height='750'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='system-ui' font-size='48' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

const getRatingColor = (rating) => {
  if (rating >= 7.5) return "text-green-600 bg-green-50 border-green-200";
  if (rating >= 6) return "text-yellow-600 bg-yellow-50 border-yellow-200";
  if (rating >= 4) return "text-orange-600 bg-orange-50 border-orange-200";
  return "text-red-600 bg-red-50 border-red-200";
};

const MovieCard = ({ movie, type }) => {
  const { fetchMovieDetails, watchListNotes, watchList, watched, collections } =
    useContext(GlobalContext);
  const [imageError, setImageError] = useState(false);

  const existingNote = watchListNotes?.[movie.id];
  const isInWatchlist = watchList.some((m) => m.id === movie.id);
  const isWatched = watched.some((m) => m.id === movie.id);

  const movieCollections = Object.entries(collections || {})
    .filter(([, collection]) =>
      collection.movies?.some((m) => m.id === movie.id)
    )
    .map(([id, collection]) => ({ id, name: collection.name }));

  const handleOpenDetails = () => {
    fetchMovieDetails(movie.id);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const tmdbRating = movie.vote_average || 0;
  const personalRating = existingNote?.rating;

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200 border-border/60">
      <div className="relative overflow-hidden bg-muted">
        {imageError ? (
          <div className="w-full h-[320px] flex flex-col items-center justify-center bg-muted">
            <Film className="h-16 w-16 text-muted-foreground/40 mb-2" />
            <span className="text-sm text-muted-foreground">
              No Image Available
            </span>
          </div>
        ) : (
          <img
            src={
              movie.poster_path
                ? IMGPATH + movie.poster_path
                : PLACEHOLDER_IMAGE
            }
            alt={movie.original_title}
            className="w-full h-[320px] object-cover"
            loading="lazy"
            style={{ imageRendering: "-webkit-optimize-contrast" }}
            onError={handleImageError}
          />
        )}

        {/* TMDB Rating Badge */}
        <div
          className={`absolute top-2 right-2 flex items-center gap-1 backdrop-blur-sm px-2 py-1 rounded-md border ${getRatingColor(
            tmdbRating
          )}`}
        >
          <Star className="h-3 w-3 fill-current" />
          <span className="text-xs font-semibold">
            {tmdbRating?.toFixed(1) || "N/A"}
          </span>
        </div>

        {/* Status Badges - Bottom Left */}
        <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
          {isWatched && (
            <Badge className="bg-green-600 hover:bg-green-600 text-white border-0 text-xs">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Watched
            </Badge>
          )}
          {isInWatchlist && !isWatched && (
            <Badge className="bg-blue-600 hover:bg-blue-600 text-white border-0 text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Watchlist
            </Badge>
          )}
          {existingNote?.note && (
            <Badge className="bg-amber-500 hover:bg-amber-500 text-white border-0 text-xs">
              <StickyNote className="h-3 w-3" />
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <CardTitle
          className="text-base line-clamp-2 mb-2"
          title={movie.original_title}
        >
          {movie.original_title}
        </CardTitle>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          {movie.release_date ? (
            <Badge variant="outline" className="text-xs">
              {new Date(movie.release_date).getFullYear()}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Year Unknown
            </Badge>
          )}

          {Number.isFinite(personalRating) && (
            <Badge variant="secondary" className="text-xs font-semibold">
              <Star className="h-3 w-3 mr-1 fill-primary text-primary" />
              My: {personalRating.toFixed(1)} / 5
            </Badge>
          )}
        </div>

        {/* Collection Badges */}
        {movieCollections.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {movieCollections.slice(0, 2).map((collection) => (
              <Badge
                key={collection.id}
                variant="outline"
                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
              >
                <FolderHeart className="h-3 w-3 mr-1" />
                {collection.name}
              </Badge>
            ))}
            {movieCollections.length > 2 && (
              <Badge
                variant="outline"
                className="text-xs bg-purple-50 text-purple-700 border-purple-200"
              >
                +{movieCollections.length - 2} more
              </Badge>
            )}
          </div>
        )}

        {existingNote?.note && (
          <p
            className="mt-2 line-clamp-2 text-xs text-muted-foreground italic border-l-2 border-amber-400 pl-2 bg-amber-50/50 py-1"
            title={existingNote.note}
          >
            "{existingNote.note}"
          </p>
        )}
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex w-full flex-col gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleOpenDetails}
            aria-label={`View details for ${movie.original_title}`}
          >
            More details
          </Button>
          <MovieControls type={type} movie={movie} />
        </div>
      </CardFooter>
    </Card>
  );
};

MovieCard.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    poster_path: PropTypes.string,
    original_title: PropTypes.string.isRequired,
    vote_average: PropTypes.number,
    release_date: PropTypes.string,
  }).isRequired,
  type: PropTypes.string.isRequired,
};

export default MovieCard;
