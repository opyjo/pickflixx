import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import MovieCard from "./MovieCard";
import { Badge } from "./ui/badge";
import { CheckCircle2, Film } from "lucide-react";

const Watched = () => {
  const { watched } = useContext(GlobalContext);

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle2 className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Watched Movies</h1>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {watched.length} {watched.length === 1 ? "Movie" : "Movies"}
          </Badge>
        </div>
      </div>

      {watched.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {watched.map((movie) => (
            <MovieCard movie={movie} key={movie.id} type="watched" />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Film className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No watched movies yet</h3>
          <p className="text-muted-foreground">
            Mark movies as watched to see them here!
          </p>
        </div>
      )}
    </div>
  );
};

export default Watched;
