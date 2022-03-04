import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import MovieCard from "./MovieCard";
import { Container } from "./styles/Container.styled";
import { Wrapper, Heading } from "./styles/Global.styled";

const WatchList = () => {
  const { watchList } = useContext(GlobalContext);

  return (
    <Wrapper>
      <div>
        <div>
          <Heading>My watchList</Heading>

          <span>
            {watchList.length} {watchList.length === 1 ? "Movie" : "Movies"}
          </span>
        </div>

        {watchList.length > 0 ? (
          <Wrapper>
            <Container gridTemplateColumns="repeat(auto-fill, minmax(15rem, 1fr))">
              {watchList.map((movie) => (
                <MovieCard movie={movie} key={movie.id} type="watchList" />
              ))}
            </Container>
          </Wrapper>
        ) : (
          <Heading>No movies in your list! Add some!</Heading>
        )}
      </div>
    </Wrapper>
  );
};

export default WatchList;
