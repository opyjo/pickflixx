import React from "react";
import MovieControls from "./MovieControls";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Star } from "lucide-react";
import PropTypes from "prop-types";

const IMGPATH = "https://image.tmdb.org/t/p/w1280";

const MovieCard = ({ movie, type }) => {
  return (
    <Card className="group overflow-hidden">
      <div className="relative overflow-hidden">
        <img
          src={IMGPATH + movie.poster_path}
          alt={movie.original_title}
          className="w-full h-[300px] object-cover transition-transform duration-300 group-hover:scale-105"
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
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {movie.release_date && (
            <Badge variant="outline" className="text-xs">
              {new Date(movie.release_date).getFullYear()}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <MovieControls type={type} movie={movie} />
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
