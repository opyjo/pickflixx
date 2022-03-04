import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import MovieControls from "./MovieControls";
import { Image } from "./styles/Image.styled";
import { Card } from "./styles/Card.styled";

const IMGPATH = "https://image.tmdb.org/t/p/w1280";

function MovieCard({ movie, type }) {
  const { addMovieToWatched, removeMovieFromWatchList } =
    useContext(GlobalContext);

  return (
    <Card>
      <Image src={IMGPATH + movie.poster_path} alt="" />

      <div>
        <h3>{movie.original_title}</h3>
      </div>
      <MovieControls type={type} movie={movie} />
    </Card>
  );
}

export default MovieCard;
