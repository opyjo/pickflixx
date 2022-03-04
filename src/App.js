import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import WatchList from "./components/WatchList";
import Watched from "./components/Watched";
import MovieDisplay from "./components/MovieDisplay";
import MovieSummary from "./components/MovieSummary";

import "./App.css";
import SearchMovies from "./components/SearchMovies";
import { GlobalProvider } from "./context/GlobalState";

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState("");

  const onMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <GlobalProvider>
      <Router basename={window.location.pathname.replace(/(\/[^/]+)$/, "")}>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <MovieDisplay
                onMovieSelect={onMovieSelect}
                selectedMovie={selectedMovie}
              />
            }
          />
          <Route
            path="/search"
            element={<SearchMovies onMovieSelect={onMovieSelect} />}
          />
          <Route path="/watchlist" element={<WatchList />} />
          <Route path="/watched" element={<Watched />} />
          <Route
            path="/summary"
            element={<MovieSummary selectedMovie={selectedMovie} />}
          />
        </Routes>
      </Router>
    </GlobalProvider>
  );
};

export default App;
