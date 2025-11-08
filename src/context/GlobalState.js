//Context API is designed to share data that can be considered "global" for a tree of React components;
import React, {
  createContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import AppReducer from "./AppReducer";
import { TMDB_API_KEY, TMDB_API_BASE_URL } from "../lib/tmdb";

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
  watchListNotes: localStorage.getItem("watchListNotes")
    ? JSON.parse(localStorage.getItem("watchListNotes"))
    : {},
  resumeProgress: localStorage.getItem("resumeProgress")
    ? JSON.parse(localStorage.getItem("resumeProgress"))
    : {},
  collections: localStorage.getItem("collections")
    ? JSON.parse(localStorage.getItem("collections"))
    : {},
  selectedMovieId: null,
  selectedMovieDetails: null,
  selectedMovieStatus: "idle",
  selectedMovieError: null,
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
    localStorage.setItem(
      "watchListNotes",
      JSON.stringify(state.watchListNotes ?? {})
    );
    localStorage.setItem(
      "resumeProgress",
      JSON.stringify(state.resumeProgress ?? {})
    );
    localStorage.setItem(
      "collections",
      JSON.stringify(state.collections ?? {})
    );
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

  const fetchMovieDetails = useCallback(
    async (movieId) => {
      if (
        state.selectedMovieDetails?.id === movieId &&
        state.selectedMovieStatus === "loaded"
      ) {
        return;
      }
      if (
        state.selectedMovieId === movieId &&
        state.selectedMovieStatus === "loading"
      ) {
        return;
      }

      dispatch({ type: "SET_SELECTED_MOVIE_LOADING", payload: movieId });

      try {
        const response = await axios.get(
          `${TMDB_API_BASE_URL}/movie/${movieId}`,
          {
            params: {
              api_key: TMDB_API_KEY,
              append_to_response: "credits,videos",
            },
          }
        );

        dispatch({
          type: "SET_SELECTED_MOVIE_SUCCESS",
          payload: response.data,
        });
      } catch (error) {
        dispatch({
          type: "SET_SELECTED_MOVIE_ERROR",
          payload: {
            movieId,
            message:
              error?.response?.data?.status_message ||
              error?.message ||
              "Unable to load movie details.",
          },
        });
      }
    },
    [
      state.selectedMovieDetails?.id,
      state.selectedMovieStatus,
      state.selectedMovieId,
    ]
  );

  const closeMovieDetails = useCallback(() => {
    dispatch({ type: "CLEAR_SELECTED_MOVIE" });
  }, []);

  const setMovieNote = useCallback((movieId, { note, rating }) => {
    const trimmedNote = (note ?? "").trim();
    const normalizedRating =
      Number.isFinite(rating) && rating >= 0 && rating <= 5
        ? Number.parseFloat(rating.toFixed(1))
        : null;

    if (!trimmedNote && normalizedRating === null) {
      dispatch({ type: "CLEAR_MOVIE_NOTE", payload: movieId });
      return;
    }

    dispatch({
      type: "SET_MOVIE_NOTE",
      payload: {
        movieId,
        data: {
          note: trimmedNote,
          rating: normalizedRating,
          updatedAt: new Date().toISOString(),
        },
      },
    });
  }, []);

  const clearMovieNote = useCallback((movieId) => {
    dispatch({ type: "CLEAR_MOVIE_NOTE", payload: movieId });
  }, []);

  const setResumeProgress = useCallback((movie, progress) => {
    if (!movie?.id) {
      return;
    }

    const safeTimestamp = Math.max(0, progress?.timestamp ?? 0);
    const safeDuration = Math.max(0, progress?.duration ?? 0);

    if (safeDuration > 0 && safeTimestamp / safeDuration >= 0.9) {
      dispatch({ type: "CLEAR_RESUME_PROGRESS", payload: movie.id });
      return;
    }

    dispatch({
      type: "SET_RESUME_PROGRESS",
      payload: {
        movieId: movie.id,
        data: {
          movie: {
            id: movie.id,
            title: movie.title ?? movie.original_title ?? "",
            original_title: movie.original_title ?? movie.title ?? "",
            poster_path: movie.poster_path ?? null,
            backdrop_path: movie.backdrop_path ?? null,
            overview: movie.overview ?? "",
            vote_average: movie.vote_average ?? null,
            release_date: movie.release_date ?? null,
          },
          timestamp: safeTimestamp,
          duration: safeDuration,
          updatedAt: new Date().toISOString(),
        },
      },
    });
  }, []);

  const clearResumeProgress = useCallback((movieId) => {
    dispatch({ type: "CLEAR_RESUME_PROGRESS", payload: movieId });
  }, []);

  const createCollection = useCallback((name, color) => {
    const id = `collection_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 11)}`;
    dispatch({
      type: "CREATE_COLLECTION",
      payload: { id, name, color },
    });
  }, []);

  const deleteCollection = useCallback((collectionId) => {
    dispatch({ type: "DELETE_COLLECTION", payload: collectionId });
  }, []);

  const addMovieToCollection = useCallback((collectionId, movie) => {
    dispatch({
      type: "ADD_MOVIE_TO_COLLECTION",
      payload: { collectionId, movie },
    });
  }, []);

  const removeMovieFromCollection = useCallback((collectionId, movieId) => {
    dispatch({
      type: "REMOVE_MOVIE_FROM_COLLECTION",
      payload: { collectionId, movieId },
    });
  }, []);

  const updateCollection = useCallback((collectionId, updates) => {
    dispatch({
      type: "UPDATE_COLLECTION",
      payload: { collectionId, updates },
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      watchList: state.watchList,
      watched: state.watched,
      movieVideo: state.movieVideo,
      addMovieToWatchList,
      addMovieToWatched,
      removeMovieFromWatchList,
      moveToWatchList,
      removeFromWatched,
      watchListNotes: state.watchListNotes ?? {},
      resumeProgress: state.resumeProgress ?? {},
      collections: state.collections ?? {},
      selectedMovieDetails: state.selectedMovieDetails,
      selectedMovieId: state.selectedMovieId,
      selectedMovieStatus: state.selectedMovieStatus,
      selectedMovieError: state.selectedMovieError,
      fetchMovieDetails,
      closeMovieDetails,
      setMovieNote,
      clearMovieNote,
      setResumeProgress,
      clearResumeProgress,
      createCollection,
      deleteCollection,
      addMovieToCollection,
      removeMovieFromCollection,
      updateCollection,
    }),
    [
      state.watchList,
      state.watched,
      state.movieVideo,
      state.watchListNotes,
      state.resumeProgress,
      state.collections,
      state.selectedMovieId,
      state.selectedMovieDetails,
      state.selectedMovieStatus,
      state.selectedMovieError,
      fetchMovieDetails,
      closeMovieDetails,
      setMovieNote,
      clearMovieNote,
      setResumeProgress,
      clearResumeProgress,
      createCollection,
      deleteCollection,
      addMovieToCollection,
      removeMovieFromCollection,
      updateCollection,
    ]
  );

  return (
    <GlobalContext.Provider value={contextValue}>
      {props.children}
    </GlobalContext.Provider>
  );
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
