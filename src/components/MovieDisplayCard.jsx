import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Play, Plus, Check, Star } from "lucide-react";
import useWatchProviders from "../hooks/useWatchProviders";
import StreamingBadges from "./StreamingBadges";

const IMGPATH = "https://image.tmdb.org/t/p/w500";

const MovieDisplayCard = ({ movie, onMovieSelect }) => {
  const navigate = useNavigate();
  const { streamingProviders } = useWatchProviders(movie.id);

  const {
    addMovieToWatchList,
    addMovieToWatched,
    watchList,
    watched,
    fetchMovieDetails,
  } = useContext(GlobalContext);

  const handleSelectMovie = () => {
    onMovieSelect(movie);
    navigate("/summary");
  };

  const handleOpenDetails = () => {
    fetchMovieDetails(movie.id);
  };

  const storedMovie = watchList.find((element) => element.id === movie.id);
  const storedMovieWatched = watched.find((mov) => mov.id === movie.id);

  const watchListDisabled = storedMovie
    ? true
    : storedMovieWatched
    ? true
    : false;
  const watchedDisabled = storedMovieWatched ? true : false;

  return (
    <Card className="overflow-hidden">
      <div className="relative overflow-hidden bg-muted">
        <img
          src={IMGPATH + movie.poster_path}
          alt={movie.original_title}
          className="w-full h-[320px] object-cover"
          loading="lazy"
          style={{ imageRendering: '-webkit-optimize-contrast' }}
        />
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
          <span className="text-xs font-semibold text-white">
            {movie.vote_average?.toFixed(1) || "N/A"}
          </span>
        </div>
      </div>

      <CardContent className="p-4">
        <CardTitle className="text-base line-clamp-2 mb-2">
          {movie.original_title}
        </CardTitle>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          {movie.release_date && (
            <Badge variant="outline" className="text-xs">
              {new Date(movie.release_date).getFullYear()}
            </Badge>
          )}
        </div>
        
        {/* Streaming Availability */}
        {streamingProviders.length > 0 && (
          <div className="mb-2">
            <StreamingBadges providers={streamingProviders} maxDisplay={2} />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col gap-2 p-4 pt-0">
        <Button
          className="w-full"
          onClick={handleSelectMovie}
          size="sm"
        >
          <Play className="h-4 w-4" />
          Watch Trailer
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleOpenDetails}
          size="sm"
        >
          More details
        </Button>

        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => addMovieToWatchList(movie)}
            disabled={watchListDisabled}
            size="sm"
          >
            {storedMovie ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Watchlist
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => addMovieToWatched(movie)}
            disabled={watchedDisabled}
            size="sm"
          >
            {storedMovieWatched ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Watched
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MovieDisplayCard;
