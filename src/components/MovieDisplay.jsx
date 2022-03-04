// Component gets movies form the IMDB API and renders this on the home page of the app
import React, { useEffect, useState } from "react";
import axios from "axios";
import MovieDisplayCard from "./MovieDisplayCard";
import { Container } from "./styles/Container.styled";
import { Wrapper } from "./styles/Global.styled";

const api_url =
  "https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc";

const MovieDisplay = ({ onMovieSelect }) => {
  const [movieList, setMovieList] = useState([]);

  useEffect(() => {
    const search = async () => {
      const movies = await axios.get(api_url, {
        params: {
          api_key: "cdec2f2873bb826dad1cc5da665e4326",
        },
      });
      setMovieList(movies.data.results);
    };
    search();
  }, []);
  // The movies array is looped over to display the MovieDisplayCard
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
  });

  return (
    <Wrapper>
      <Container gridTemplateColumns="repeat(auto-fit, minmax(15rem, 1fr))">
        {renderedList}
      </Container>
    </Wrapper>
  );
};

export default MovieDisplay;
