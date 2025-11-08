const AppReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MOVIE_TO_WATCHLIST":
      return {
        ...state,
        watchList: [action.payload, ...state.watchList],
      };

    case "REMOVE_MOVIE_FROM_WATCHLIST":
      return {
        ...state,
        watchList: state.watchList.filter(
          (movie) => movie.id !== action.payload
        ),
      };

    case "ADD_MOVIE_TO_WATCHED":
      return {
        ...state,
        watchList: state.watchList.filter(
          (movie) => movie.id !== action.payload.id
        ),
        watched: [action.payload, ...state.watched],
      };

    case "MOVE_TO_WATCHLIST":
      return {
        ...state,
        watched: state.watched.filter(
          (movie) => movie.id !== action.payload.id
        ),
        watchList: [action.payload, ...state.watchList],
      };

    case "REMOVE_FROM_WATCHED":
      return {
        ...state,
        watched: state.watched.filter((movie) => movie.id !== action.payload),
      };

    case "SET_SELECTED_MOVIE_LOADING":
      return {
        ...state,
        selectedMovieId: action.payload,
        selectedMovieStatus: "loading",
        selectedMovieError: null,
      };

    case "SET_SELECTED_MOVIE_SUCCESS":
      return {
        ...state,
        selectedMovieDetails: action.payload,
        selectedMovieId: action.payload.id,
        selectedMovieStatus: "loaded",
        selectedMovieError: null,
      };

    case "SET_SELECTED_MOVIE_ERROR":
      return {
        ...state,
        selectedMovieId: action.payload?.movieId ?? state.selectedMovieId,
        selectedMovieStatus: "error",
        selectedMovieError: action.payload?.message ?? action.payload,
      };

    case "CLEAR_SELECTED_MOVIE":
      return {
        ...state,
        selectedMovieDetails: null,
        selectedMovieId: null,
        selectedMovieStatus: "idle",
        selectedMovieError: null,
      };

    case "SET_MOVIE_NOTE": {
      const { movieId, data } = action.payload;
      return {
        ...state,
        watchListNotes: {
          ...state.watchListNotes,
          [movieId]: data,
        },
      };
    }

    case "CLEAR_MOVIE_NOTE": {
      if (!state.watchListNotes) {
        return state;
      }

      const updatedNotes = { ...state.watchListNotes };
      delete updatedNotes[action.payload];

      return {
        ...state,
        watchListNotes: updatedNotes,
      };
    }

    case "SET_RESUME_PROGRESS": {
      const { movieId, data } = action.payload;
      return {
        ...state,
        resumeProgress: {
          ...state.resumeProgress,
          [movieId]: data,
        },
      };
    }

    case "CLEAR_RESUME_PROGRESS": {
      if (!state.resumeProgress) {
        return state;
      }
      const updatedProgress = { ...state.resumeProgress };
      delete updatedProgress[action.payload];
      return {
        ...state,
        resumeProgress: updatedProgress,
      };
    }

    case "CREATE_COLLECTION": {
      const { id, name, color } = action.payload;
      return {
        ...state,
        collections: {
          ...state.collections,
          [id]: {
            name,
            color,
            movies: [],
            createdAt: new Date().toISOString(),
          },
        },
      };
    }

    case "DELETE_COLLECTION": {
      const updatedCollections = { ...state.collections };
      delete updatedCollections[action.payload];
      return {
        ...state,
        collections: updatedCollections,
      };
    }

    case "ADD_MOVIE_TO_COLLECTION": {
      const { collectionId, movie } = action.payload;
      const collection = state.collections[collectionId];
      if (!collection) {
        return state;
      }

      const movieExists = collection.movies.some((m) => m.id === movie.id);
      if (movieExists) {
        return state;
      }

      return {
        ...state,
        collections: {
          ...state.collections,
          [collectionId]: {
            ...collection,
            movies: [movie, ...collection.movies],
          },
        },
      };
    }

    case "REMOVE_MOVIE_FROM_COLLECTION": {
      const { collectionId, movieId } = action.payload;
      const collection = state.collections[collectionId];
      if (!collection) {
        return state;
      }

      return {
        ...state,
        collections: {
          ...state.collections,
          [collectionId]: {
            ...collection,
            movies: collection.movies.filter((m) => m.id !== movieId),
          },
        },
      };
    }

    case "UPDATE_COLLECTION": {
      const { collectionId, updates } = action.payload;
      const collection = state.collections[collectionId];
      if (!collection) {
        return state;
      }

      return {
        ...state,
        collections: {
          ...state.collections,
          [collectionId]: {
            ...collection,
            ...updates,
          },
        },
      };
    }

    default:
      return state;
  }
};

export default AppReducer;
