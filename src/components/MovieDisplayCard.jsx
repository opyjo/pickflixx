import React, { useContext } from "react";
import { Image } from "./styles/Image.styled";
import { Card } from "./styles/Card.styled";
import { StyledButton } from "./styles/StyledButton.styled";
import { Flex } from "./styles/Global.styled";
import { useNavigate } from "react-router-dom";
import { IoIosAdd } from "react-icons/io";
import { GlobalContext } from "../context/GlobalState";
import { GiPlayButton } from "react-icons/gi";
const IMGPATH = "https://image.tmdb.org/t/p/w1280";

function MovieDisplayCard({ movie, onMovieSelect }) {
  // navigating on clicking the "watch Trailer button".
  const navigate = useNavigate();

  // function call passes the movie data to the App component parent so that the MovieSummary component can use the data.
  const onSelectMovie = () => {
    onMovieSelect(movie);
    navigate("/summary");
  };

  // connecting the component to the Context API.
  const { addMovieToWatchList, addMovieToWatched, watchList, watched } =
    useContext(GlobalContext);

  // Code to avoid adding duplicate movie to the movielist by checking for the moveid in the watchlist
  let storedMovie = watchList.find((element) => element.id === movie.id);
  let storedMovieWatched = watched.find((mov) => mov.id === movie.id);

  // code to disabled the watched and watchlist button once the movie has already been selected.
  const watchListDisabled = storedMovie
    ? true
    : storedMovieWatched
    ? true
    : false;
  const watchedDisabled = storedMovieWatched ? true : false;

  return (
    <Card>
      <Image src={IMGPATH + movie.poster_path} alt="" />
      <div>
        <h3>{movie.original_title}</h3>
      </div>
      <div>
        {/* button adds the movie to the store as an action(function) */}
        <StyledButton mgLeft="30%" bg="#800000" onClick={onSelectMovie}>
          <GiPlayButton />
          WATCH TRAILER
        </StyledButton>
        <Flex justifyContent="space-around">
          <StyledButton
            bg="#001242"
            onClick={() => addMovieToWatchList(movie)}
            disabled={watchListDisabled}
          >
            <IoIosAdd />
            WATCHLIST
          </StyledButton>
          <StyledButton
            bg="#001242"
            onClick={() => addMovieToWatched(movie)}
            disabled={watchedDisabled}
          >
            <IoIosAdd />
            WATCHED
          </StyledButton>
        </Flex>
      </div>
    </Card>
  );
}

export default MovieDisplayCard;
