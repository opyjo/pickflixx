//Context API is designed to share data that can be considered "global" for a tree of React components;
import React, { createContext, useReducer, useEffect } from "react";

import AppReducer from "./AppReducer";

// code sets up the initial for the context API.
// because we are making use of the local storage, when the page loads it is going to take the values from the local storage.
// the condition checks if movie is already in local storage, if not the initialstate is an empty array.
const initialState = {
  watchList: localStorage.getItem("watchList")
    ? JSON.parse(localStorage.getItem("watchList"))
    : [],
  watched: localStorage.getItem("watched")
    ? JSON.parse(localStorage.getItem("watched"))
    : [],
};

// code to create the context object.
export const GlobalContext = createContext(initialState);

// code creates the provider which allows all the component to consume the changes in the store(Global context API) or acces the store. This is similar to the Redux store Provider which makes the Redux store available to any nested components that need to access the store.
//useReducer

//useReducer creates the action(function) that are dispatched to the reducer to effect changes in the component.
export const GlobalProvider = (props) => {
  const [state, dispatch] = useReducer(AppReducer, initialState);

  //code to persist the watchList in the local storage.
  useEffect(() => {
    localStorage.setItem("watchList", JSON.stringify(state.watchList));
    localStorage.setItem("watched", JSON.stringify(state.watched));
  }, [state]);

  // to add movie to the watchlist.
  const addMovieToWatchList = (movie) => {
    dispatch({ type: "ADD_MOVIE_TO_WATCHLIST", payload: movie });
  };

  const removeMovieFromWatchList = (id) => {
    dispatch({ type: "REMOVE_MOVIE_FROM_WATCHLIST", payload: id });
  };

  const addMovieToWatched = (movie) => {
    dispatch({ type: "ADD_MOVIE_TO_WATCHED", payload: movie });
  };

  const moveToWatchList = (movie) => {
    dispatch({ type: "MOVE_TO_WATCHLIST", payload: movie });
  };

  const removeFromWatched = (id) => {
    dispatch({ type: "REMOVE_FROM_WATCHED", payload: id });
  };

  return (
    <GlobalContext.Provider
      value={{
        watchList: state.watchList,
        watched: state.watched,
        movieVideo: state.movieVideo,
        addMovieToWatchList,
        addMovieToWatched,
        removeMovieFromWatchList,
        moveToWatchList,
        removeFromWatched,
      }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};
