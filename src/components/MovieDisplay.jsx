import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieDisplayCard from "./MovieDisplayCard";
import { Film, TrendingUp } from "lucide-react";

const api_url =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc";

const MovieDisplay = ({ onMovieSelect }) => {
  const [movieList, setMovieList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const search = async () => {
      try {
        const movies = await axios.get(api_url, {
          params: {
            api_key: "cdec2f2873bb826dad1cc5da665e4326",
          },
        });
        setMovieList(movies.data.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };
    search();
  }, []);

  const renderedList = movieList.map((movie) => {
    if (movie.poster_path !== null) {
      return (
        <MovieDisplayCard
          onMovieSelect={onMovieSelect}
          key={movie.id}
          movie={movie}
        />
      );
    }
    return null;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Popular Movies</h1>
        </div>
        <p className="text-muted-foreground">
          Discover the most popular movies right now
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-[450px] rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
      ) : movieList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {renderedList}
        </div>
      ) : (
        <div className="text-center py-16">
          <Film className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No movies found</p>
        </div>
      )}
    </div>
  );
};

export default MovieDisplay;
