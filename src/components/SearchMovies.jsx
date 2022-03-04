import React, { useState } from "react";
import MovieDisplayCard from "./MovieDisplayCard";
import { InputContainer } from "./styles/Search.styled";
import { Wrapper } from "./styles/Global.styled";
import { Container } from "./styles/Container.styled";
import axios from "axios";
const search_api =
  "https://api.themoviedb.org/3/search/movie?api_key=cdec2f2873bb826dad1cc5da665e4326";

const SearchMovies = ({ onMovieSelect }) => {
  // code get the input from the user to make the component controlled.
  const [term, setTerm] = useState("");
  const [movies, setMovies] = useState([]);

  const onChange = (e) => {
    e.preventDefault();
    setTerm(e.target.value);

    const searchFunction = async () => {
      const movies = await axios.get(search_api, {
        params: {
          query: term,
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
  });

  return (
    <>
      <Wrapper>
        <InputContainer>
          <input
            value={term}
            onChange={onChange}
            type="text"
            placeholder="Search for a movie"
          />
        </InputContainer>
      </Wrapper>

      <Wrapper>
        <Container gridTemplateColumns="repeat(auto-fit, minmax(15rem, 1fr))">
          {renderedList}
        </Container>
      </Wrapper>
    </>
  );
};

export default SearchMovies;
