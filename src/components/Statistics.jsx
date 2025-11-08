import React, { useContext, useMemo } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

const Statistics = () => {
  const { watched, watchList, watchListNotes } = useContext(GlobalContext);

  const stats = useMemo(() => {
    // Total counts
    const totalWatched = watched.length;
    const totalWatchlist = watchList.length;
    const totalMovies = totalWatched + totalWatchlist;

    // Genre analysis from watched movies
    const genreCount = {};
    watched.forEach((movie) => {
      if (movie.genre_ids) {
        movie.genre_ids.forEach((genreId) => {
          genreCount[genreId] = (genreCount[genreId] || 0) + 1;
        });
      }
    });

    const topGenres = Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Rating statistics
    const notesArray = Object.values(watchListNotes).filter(
      (note) => note && Number.isFinite(note.rating)
    );
    const totalRatings = notesArray.length;
    const avgRating =
      totalRatings > 0
        ? (
            notesArray.reduce((sum, note) => sum + note.rating, 0) /
            totalRatings
          ).toFixed(1)
        : 0;

    // Rating distribution
    const ratingDistribution = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    notesArray.forEach((note) => {
      const roundedRating = Math.floor(note.rating);
      if (roundedRating >= 0 && roundedRating <= 5) {
        ratingDistribution[roundedRating]++;
      }
    });

    // Year analysis from watched movies
    const yearCount = {};
    watched.forEach((movie) => {
      if (movie.release_date) {
        const year = new Date(movie.release_date).getFullYear();
        if (!Number.isNaN(year)) {
          yearCount[year] = (yearCount[year] || 0) + 1;
        }
      }
    });

    const topYears = Object.entries(yearCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    // Current year/month stats
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    const watchedThisYear = watched.filter((movie) => {
      const watchedDate = watchListNotes[movie.id]?.updatedAt;
      if (!watchedDate) return false;
      const year = new Date(watchedDate).getFullYear();
      return year === currentYear;
    }).length;

    const watchedThisMonth = watched.filter((movie) => {
      const watchedDate = watchListNotes[movie.id]?.updatedAt;
      if (!watchedDate) return false;
      const date = new Date(watchedDate);
      return (
        date.getFullYear() === currentYear && date.getMonth() === currentMonth
      );
    }).length;

    // TMDB rating analysis
    const avgTMDBRating =
      totalWatched > 0
        ? (
            watched.reduce(
              (sum, movie) => sum + (movie.vote_average || 0),
              0
            ) / totalWatched
          ).toFixed(1)
        : 0;

    return {
      totalWatched,
      totalWatchlist,
      totalMovies,
      topGenres,
      totalRatings,
      avgRating,
      ratingDistribution,
      topYears,
      watchedThisYear,
      watchedThisMonth,
      avgTMDBRating,
    };
  }, [watched, watchList, watchListNotes]);

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

  const getRatingColor = (rating) => {
    if (rating >= 4) return "bg-green-500";
    if (rating >= 3) return "bg-blue-500";
    if (rating >= 2) return "bg-yellow-500";
    if (rating >= 1) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Your Movie Statistics</h1>
        <p className="text-muted-foreground">
          Insights into your movie collection and viewing habits
        </p>
      </div>

      {/* Overview Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Movies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalMovies}</div>
            <p className="text-xs text-muted-foreground">
              In your collection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Watched
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalWatched}</div>
            <p className="text-xs text-muted-foreground">
              {stats.watchedThisYear} this year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Watchlist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalWatchlist}</div>
            <p className="text-xs text-muted-foreground">Movies to watch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.watchedThisMonth}</div>
            <p className="text-xs text-muted-foreground">Movies watched</p>
          </CardContent>
        </Card>
      </div>

      {/* Rating Statistics */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalRatings === 0 ? (
              <p className="text-sm text-muted-foreground">
                No ratings yet. Start rating movies to see statistics!
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Average Rating
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {stats.avgRating}
                    </span>
                    <span className="text-sm text-muted-foreground">/ 5.0</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Ratings
                  </span>
                  <span className="text-xl font-semibold">
                    {stats.totalRatings}
                  </span>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2 pt-4">
                  <p className="text-sm font-medium">Rating Distribution</p>
                  {[5, 4, 3, 2, 1, 0].map((rating) => {
                    const count = stats.ratingDistribution[rating];
                    const percentage =
                      stats.totalRatings > 0
                        ? (count / stats.totalRatings) * 100
                        : 0;
                    return (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="w-8 text-sm">{rating}★</span>
                        <div className="flex-1 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={`h-4 rounded-full ${getRatingColor(
                              rating
                            )} transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-12 text-right text-sm text-muted-foreground">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Community Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.totalWatched === 0 ? (
              <p className="text-sm text-muted-foreground">
                Watch movies to see average TMDB ratings!
              </p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Avg TMDB Rating
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {stats.avgTMDBRating}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      / 10.0
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Average rating from The Movie Database for movies you've
                  watched
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Genre and Year Statistics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Genres</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topGenres.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Watch movies to see your favorite genres!
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topGenres.map(([genreId, count]) => {
                  const percentage =
                    stats.totalWatched > 0
                      ? ((count / stats.totalWatched) * 100).toFixed(0)
                      : 0;
                  return (
                    <div key={genreId} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {genreIdToName[genreId] || `Genre ${genreId}`}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {count} movies ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Release Years</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topYears.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Watch movies to see popular release years!
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topYears.map(([year, count]) => {
                  const percentage =
                    stats.totalWatched > 0
                      ? ((count / stats.totalWatched) * 100).toFixed(0)
                      : 0;
                  return (
                    <div key={year} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{year}</span>
                        <span className="text-sm text-muted-foreground">
                          {count} movies ({percentage}%)
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Empty State Message */}
      {stats.totalMovies === 0 && (
        <Card className="mt-8">
          <CardContent className="py-12 text-center">
            <h3 className="mb-2 text-lg font-semibold">No Data Yet</h3>
            <p className="text-sm text-muted-foreground">
              Start adding movies to your watchlist or watched list to see your
              statistics!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Statistics;

