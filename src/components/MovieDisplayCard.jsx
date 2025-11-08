import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Play, Plus, Check, Star } from "lucide-react";

const IMGPATH = "https://image.tmdb.org/t/p/w1280";

const MovieDisplayCard = ({ movie, onMovieSelect }) => {
  const navigate = useNavigate();

  const handleSelectMovie = () => {
    onMovieSelect(movie);
    navigate("/summary");
  };

  const { addMovieToWatchList, addMovieToWatched, watchList, watched } =
    useContext(GlobalContext);

  const storedMovie = watchList.find((element) => element.id === movie.id);
  const storedMovieWatched = watched.find((mov) => mov.id === movie.id);

  const watchListDisabled = storedMovie
    ? true
    : storedMovieWatched
    ? true
    : false;
  const watchedDisabled = storedMovieWatched ? true : false;

  return (
    <Card className="group overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={IMGPATH + movie.poster_path}
          alt={movie.original_title}
          className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {movie.release_date && (
            <Badge variant="outline" className="text-xs">
              {new Date(movie.release_date).getFullYear()}
            </Badge>
          )}
        </div>
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
