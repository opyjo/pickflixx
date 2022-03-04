import React, { useContext } from "react";
import { IoIosAdd } from "react-icons/io";
import { GlobalContext } from "../context/GlobalState";
import { StyledButton } from "./styles/StyledButton.styled";
import { Flex } from "./styles/Global.styled";

function MovieControls({ movie, type }) {
  const {
    removeMovieFromWatchList,
    addMovieToWatched,
    moveToWatchList,
    removeFromWatched,
  } = useContext(GlobalContext);

  return (
    <div>
      {type === "watchList" && (
        <Flex justifyContent="space-around">
          <StyledButton
            bg="#7395ae"
            onClick={() => removeMovieFromWatchList(movie.id)}
            className="btn"
          >
            <IoIosAdd />
            REMOVE
          </StyledButton>
          <StyledButton
            bg="#7395ae"
            onClick={() => addMovieToWatched(movie)}
            className="btn"
          >
            <IoIosAdd />
            WATCHED
          </StyledButton>
        </Flex>
      )}

      {type === "watched" && (
        <Flex justifyContent="space-around">
          <StyledButton
            bg="#7395ae"
            onClick={() => moveToWatchList(movie)}
            className="btn"
          >
            <IoIosAdd />
            WATCHLIST
          </StyledButton>
          <StyledButton
            bg="#7395ae"
            onClick={() => removeFromWatched(movie.id)}
            className="btn"
          >
            <IoIosAdd />
            REMOVE
          </StyledButton>
        </Flex>
      )}
    </div>
  );
}

export default MovieControls;
