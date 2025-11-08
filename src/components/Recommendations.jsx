import React, { useContext, useState, useEffect } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import MovieCard from "./MovieCard";
import axios from "axios";
import { TMDB_API_KEY, TMDB_API_BASE_URL } from "../lib/tmdb";

const Recommendations = () => {
  const { watched, watchList } = useContext(GlobalContext);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularGenreMovies, setPopularGenreMovies] = useState([]);
  const [isLoadingSimilar, setIsLoadingSimilar] = useState(false);
  const [isLoadingTrending, setIsLoadingTrending] = useState(false);
  const [isLoadingGenre, setIsLoadingGenre] = useState(false);
  const [selectedTab, setSelectedTab] = useState("similar");

  const allMovies = [...watched, ...watchList];
  const hasMovies = allMovies.length > 0;

  // Get most popular genre from watched movies
  const getMostPopularGenre = () => {
    const genreCount = {};
    for (const movie of watched) {
      if (movie.genre_ids) {
        for (const genreId of movie.genre_ids) {
          genreCount[genreId] = (genreCount[genreId] || 0) + 1;
        }
      }
    }

    const sortedGenres = Object.entries(genreCount).sort(
      ([, a], [, b]) => b - a
    );
    return sortedGenres.length > 0 ? sortedGenres[0][0] : null;
  };

  const genreIdToName = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    80: "Crime",
    99: "Documentary",
    18: "Drama",
    10751: "Family",
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: "Music",
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie",
    53: "Thriller",
    10752: "War",
    37: "Western",
  };

  // Fetch similar movies based on watched movies
  const fetchSimilarMovies = async () => {
    if (watched.length === 0) {
      return;
    }

    setIsLoadingSimilar(true);
    try {
      // Get a random movie from watched list
      const randomMovie = watched[Math.floor(Math.random() * watched.length)];

      const response = await axios.get(
        `${TMDB_API_BASE_URL}/movie/${randomMovie.id}/recommendations`,
        {
          params: {
            api_key: TMDB_API_KEY,
          },
        }
      );

      // Filter out movies already in watchlist or watched
      const existingMovieIds = new Set(allMovies.map((m) => m.id));
      const filteredMovies = response.data.results
        .filter((movie) => !existingMovieIds.has(movie.id))
        .slice(0, 12);

      setSimilarMovies(filteredMovies);
    } catch (error) {
      console.error("Error fetching similar movies:", error);
    } finally {
      setIsLoadingSimilar(false);
    }
  };

  // Fetch trending movies
  const fetchTrendingMovies = async () => {
    setIsLoadingTrending(true);
    try {
      const response = await axios.get(
        `${TMDB_API_BASE_URL}/trending/movie/week`,
        {
          params: {
            api_key: TMDB_API_KEY,
          },
        }
      );

      // Filter out movies already in collection
      const existingMovieIds = new Set(allMovies.map((m) => m.id));
      const filteredMovies = response.data.results
        .filter((movie) => !existingMovieIds.has(movie.id))
        .slice(0, 12);

      setTrendingMovies(filteredMovies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    } finally {
      setIsLoadingTrending(false);
    }
  };

  // Fetch popular movies in favorite genre
  const fetchPopularGenreMovies = async () => {
    const topGenre = getMostPopularGenre();
    if (!topGenre) {
      return;
    }

    setIsLoadingGenre(true);
    try {
      const response = await axios.get(`${TMDB_API_BASE_URL}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: topGenre,
          sort_by: "popularity.desc",
          "vote_count.gte": 100,
        },
      });

      // Filter out movies already in collection
      const existingMovieIds = new Set(allMovies.map((m) => m.id));
      const filteredMovies = response.data.results
        .filter((movie) => !existingMovieIds.has(movie.id))
        .slice(0, 12);

      setPopularGenreMovies(filteredMovies);
    } catch (error) {
      console.error("Error fetching genre movies:", error);
    } finally {
      setIsLoadingGenre(false);
    }
  };

  useEffect(() => {
    if (selectedTab === "similar") {
      fetchSimilarMovies();
    } else if (selectedTab === "trending") {
      fetchTrendingMovies();
    } else if (selectedTab === "genre") {
      fetchPopularGenreMovies();
    }
  }, [selectedTab]);

  const renderMovieGrid = (movies, isLoading) => {
    if (isLoading) {
      const skeletons = Array.from({ length: 8 }, (_, i) => i);
      return (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {skeletons.map((skeletonId) => (
            <Card key={`skeleton-${skeletonId}`}>
              <Skeleton className="aspect-[2/3] w-full" />
              <CardContent className="p-3">
                <Skeleton className="mb-2 h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (movies.length === 0) {
      return (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No recommendations available at the moment. Try watching more
              movies!
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} type="discover" />
        ))}
      </div>
    );
  };

  const topGenre = getMostPopularGenre();
  const topGenreName = topGenre ? genreIdToName[topGenre] : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Recommendations</h1>
        <p className="text-muted-foreground">
          Discover new movies based on your taste and trending content
        </p>
      </div>

      {hasMovies ? (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            <Button
              variant={selectedTab === "similar" ? "default" : "outline"}
              onClick={() => setSelectedTab("similar")}
              disabled={watched.length === 0}
            >
              <i className="fas fa-lightbulb mr-2" />
              Similar to Watched
            </Button>
            <Button
              variant={selectedTab === "trending" ? "default" : "outline"}
              onClick={() => setSelectedTab("trending")}
            >
              <i className="fas fa-fire mr-2" />
              Trending This Week
            </Button>
            {topGenreName && (
              <Button
                variant={selectedTab === "genre" ? "default" : "outline"}
                onClick={() => setSelectedTab("genre")}
              >
                <i className="fas fa-star mr-2" />
                Popular {topGenreName}
              </Button>
            )}
          </div>

          <div className="space-y-6">
            {selectedTab === "similar" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Similar to Your Watched Movies
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Based on movies you&apos;ve already watched
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchSimilarMovies}
                    disabled={isLoadingSimilar}
                  >
                    <i className="fas fa-sync mr-2" />
                    Refresh
                  </Button>
                </div>
                {renderMovieGrid(similarMovies, isLoadingSimilar)}
              </div>
            )}

            {selectedTab === "trending" && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Trending This Week
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      What everyone is watching right now
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchTrendingMovies}
                    disabled={isLoadingTrending}
                  >
                    <i className="fas fa-sync mr-2" />
                    Refresh
                  </Button>
                </div>
                {renderMovieGrid(trendingMovies, isLoadingTrending)}
              </div>
            )}

            {selectedTab === "genre" && topGenreName && (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      Popular {topGenreName} Movies
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Your most watched genre
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={fetchPopularGenreMovies}
                    disabled={isLoadingGenre}
                  >
                    <i className="fas fa-sync mr-2" />
                    Refresh
                  </Button>
                </div>
                {renderMovieGrid(popularGenreMovies, isLoadingGenre)}
              </div>
            )}
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <i className="fas fa-compass text-2xl text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No Data Yet</h3>
            <p className="text-sm text-muted-foreground">
              Add movies to your watchlist or watched list to get personalized
              recommendations!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Recommendations;
