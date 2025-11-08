import React, { useState } from "react";
import MovieDisplayCard from "./MovieDisplayCard";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import axios from "axios";

const search_api =
  "https://api.themoviedb.org/3/search/movie?api_key=cdec2f2873bb826dad1cc5da665e4326";

const SearchMovies = ({ onMovieSelect }) => {
  const [term, setTerm] = useState("");
  const [movies, setMovies] = useState([]);

  const handleChange = (e) => {
    e.preventDefault();
    setTerm(e.target.value);

    const searchFunction = async () => {
      const movies = await axios.get(search_api, {
        params: {
          query: e.target.value,
        },
      });
      setMovies(movies.data.results);
    };
    searchFunction();
  };

  const renderedList = movies.map((movie) => {
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
        <h1 className="text-3xl font-bold mb-2">Search Movies</h1>
        <p className="text-muted-foreground">
          Discover your next favorite movie
        </p>
      </div>

      <div className="relative mb-8 max-w-2xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={term}
          onChange={handleChange}
          type="text"
          placeholder="Search for a movie..."
          className="pl-10 h-12 text-base"
        />
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {renderedList}
        </div>
      ) : term ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No movies found. Try a different search term.</p>
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Start typing to search for movies</p>
        </div>
      )}
    </div>
  );
};

export default SearchMovies;
