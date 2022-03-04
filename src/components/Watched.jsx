import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import MovieCard from "./MovieCard";
import { Container } from "./styles/Container.styled";
import { Wrapper, Heading } from "./styles/Global.styled";

const Watched = () => {
  const { watched } = useContext(GlobalContext);

  return (
    <Wrapper>
      <div>
        <Heading>Watched Movies</Heading>

        <span>
          {watched.length} {watched.length === 1 ? "Movie" : "Movies"}
        </span>
      </div>

      {watched.length > 0 ? (
        <Container gridTemplateColumns="repeat(auto-fill, minmax(15rem, 1fr))">
          {watched.map((movie) => (
            <MovieCard movie={movie} key={movie.id} type="watched" />
          ))}
        </Container>
      ) : (
        <Heading>No movies in your list! Add some movies!</Heading>
      )}
    </Wrapper>
  );
};

export default Watched;
