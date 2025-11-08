import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import WatchList from "./components/WatchList";
import Watched from "./components/Watched";
import MovieDisplay from "./components/MovieDisplay";
import MovieSummary from "./components/MovieSummary";
import Statistics from "./components/Statistics";
import Collections from "./components/Collections";
import Recommendations from "./components/Recommendations";
import Dashboard from "./components/Dashboard";

import "./App.css";
import SearchMovies from "./components/SearchMovies";
import { GlobalProvider } from "./context/GlobalState";
import { ThemeProvider } from "./context/ThemeContext";
import MovieDetailsSheet from "./components/MovieDetailsSheet";

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const onMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  return (
    <ThemeProvider>
      <GlobalProvider>
        <Router >
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/search"
              element={<SearchMovies onMovieSelect={onMovieSelect} />}
            />
            <Route path="/watchlist" element={<WatchList />} />
            <Route path="/watched" element={<Watched />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route
              path="/summary"
              element={<MovieSummary selectedMovie={selectedMovie} />}
            />
          </Routes>
          <MovieDetailsSheet onWatchTrailer={onMovieSelect} />
        </Router>
      </GlobalProvider>
    </ThemeProvider>
  );
};

export default App;
