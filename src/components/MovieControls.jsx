import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Button } from "./ui/button";
import { Trash2, Check, Clock } from "lucide-react";

const MovieControls = ({ movie, type }) => {
  const {
    removeMovieFromWatchList,
    addMovieToWatched,
    moveToWatchList,
    removeFromWatched,
  } = useContext(GlobalContext);

  return (
    <div className="flex gap-2 w-full">
      {type === "watchList" && (
        <>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => addMovieToWatched(movie)}
            size="sm"
          >
            <Check className="h-4 w-4" />
            Watched
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => removeMovieFromWatchList(movie.id)}
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </>
      )}

      {type === "watched" && (
        <>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => moveToWatchList(movie)}
            size="sm"
          >
            <Clock className="h-4 w-4" />
            Watchlist
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => removeFromWatched(movie.id)}
            size="sm"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </>
      )}
    </div>
  );
};

export default MovieControls;
