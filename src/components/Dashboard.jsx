import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import {
  Film,
  Clock,
  CheckCircle2,
  TrendingUp,
  Star,
  FolderHeart,
  ArrowRight,
} from "lucide-react";

const QuickStatCard = ({ icon: Icon, label, value, sublabel, color, onClick }) => {
  return (
    <Card 
      className={`overflow-hidden border-l-2 transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''}`}
      style={{ borderLeftColor: color }}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <h3 className="text-xl font-bold tracking-tight">{value}</h3>
            {sublabel && (
              <p className="text-[10px] text-muted-foreground">{sublabel}</p>
            )}
          </div>
          <div
            className="rounded-lg p-1.5"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon className="h-4 w-4" style={{ color }} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const DashboardHome = () => {
  const { watchList, watched, collections, watchListNotes } = useContext(GlobalContext);
  const navigate = useNavigate();

  const collectionsCount = Object.keys(collections || {}).length;
  
  const notesArray = Object.values(watchListNotes).filter(
    (note) => note && Number.isFinite(note.rating)
  );
  const avgRating =
    notesArray.length > 0
      ? (
          notesArray.reduce((sum, note) => sum + note.rating, 0) /
          notesArray.length
        ).toFixed(1)
      : 0;

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const watchedThisMonth = watched.filter((movie) => {
    const watchedDate = watchListNotes[movie.id]?.updatedAt;
    if (!watchedDate) return false;
    const date = new Date(watchedDate);
    return (
      date.getFullYear() === currentYear && date.getMonth() === currentMonth
    );
  }).length;

  const quickActions = [
    {
      title: "Latest Movies",
      description: "Browse the newest movie releases",
      icon: TrendingUp,
      color: "#3b82f6",
      action: () => navigate("/"),
    },
    {
      title: "Get Recommendations",
      description: "Find movies based on your taste",
      icon: Star,
      color: "#f59e0b",
      action: () => navigate("/recommendations"),
    },
    {
      title: "View Statistics",
      description: "See your movie watching insights",
      icon: Film,
      color: "#8b5cf6",
      action: () => navigate("/statistics"),
    },
    {
      title: "Manage Collections",
      description: "Organize movies into custom lists",
      icon: FolderHeart,
      color: "#ec4899",
      action: () => navigate("/collections"),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 max-w-screen-2xl">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col gap-1 mb-6">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome to <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">PickFlixx</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Your personal movie companion. Track, discover, and enjoy.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <QuickStatCard
              icon={Clock}
              label="Watchlist"
              value={watchList.length}
              sublabel="Movies to watch"
              color="#f59e0b"
              onClick={() => navigate("/watchlist")}
            />
            <QuickStatCard
              icon={CheckCircle2}
              label="Watched"
              value={watched.length}
              sublabel={`${watchedThisMonth} this month`}
              color="#10b981"
              onClick={() => navigate("/watched")}
            />
            <QuickStatCard
              icon={FolderHeart}
              label="Collections"
              value={collectionsCount}
              sublabel="Custom lists"
              color="#ec4899"
              onClick={() => navigate("/collections")}
            />
            <QuickStatCard
              icon={Star}
              label="Avg Rating"
              value={avgRating > 0 ? `${avgRating}/5` : "N/A"}
              sublabel={`${notesArray.length} rated`}
              color="#8b5cf6"
              onClick={() => navigate("/statistics")}
            />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <div className="mb-4">
            <h2 className="text-lg font-bold tracking-tight mb-1">Quick Actions</h2>
            <p className="text-xs text-muted-foreground">
              Jump right into what you need
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action) => (
              <Card
                key={action.title}
                className="group cursor-pointer border-border/60 transition-all hover:border-border hover:shadow-md"
                onClick={action.action}
              >
                <CardHeader className="pb-2 pt-3 px-3">
                  <div
                    className="mb-2 inline-flex rounded-lg p-2 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${action.color}15` }}
                  >
                    <action.icon className="h-4 w-4" style={{ color: action.color }} />
                  </div>
                  <CardTitle className="text-sm">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="pb-3 px-3">
                  <p className="text-xs text-muted-foreground mb-2">
                    {action.description}
                  </p>
                  <div className="flex items-center text-xs font-medium text-primary">
                    Go <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {(watchList.length > 0 || watched.length > 0) && (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold tracking-tight mb-1">Recent Activity</h2>
              <p className="text-xs text-muted-foreground">
                Your latest movies
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {/* Recent Watchlist */}
              {watchList.length > 0 && (
                <Card className="border-border/60">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-1.5 text-sm">
                        <Clock className="h-4 w-4 text-amber-500" />
                        Recent Watchlist
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/watchlist")}
                        className="h-7 text-xs"
                      >
                        View all
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <div className="space-y-2">
                      {watchList.slice(0, 3).map((movie) => (
                        <div
                          key={movie.id}
                          className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 p-2 transition-colors hover:bg-muted/60"
                        >
                          <div className="h-10 w-7 flex-shrink-0 overflow-hidden rounded">
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt={movie.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Film className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate font-medium text-xs">
                              {movie.title || movie.original_title}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {movie.release_date
                                ? new Date(movie.release_date).getFullYear()
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recently Watched */}
              {watched.length > 0 && (
                <Card className="border-border/60">
                  <CardHeader className="pb-2 pt-3 px-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-1.5 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        Recently Watched
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/watched")}
                        className="h-7 text-xs"
                      >
                        View all
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 pb-3">
                    <div className="space-y-2">
                      {watched.slice(0, 3).map((movie) => (
                        <div
                          key={movie.id}
                          className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 p-2 transition-colors hover:bg-muted/60"
                        >
                          <div className="h-10 w-7 flex-shrink-0 overflow-hidden rounded">
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                alt={movie.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-muted">
                                <Film className="h-3 w-3 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="truncate font-medium text-xs">
                              {movie.title || movie.original_title}
                            </p>
                            <div className="flex items-center gap-1.5">
                              <p className="text-[10px] text-muted-foreground">
                                {movie.release_date
                                  ? new Date(movie.release_date).getFullYear()
                                  : "N/A"}
                              </p>
                              {watchListNotes[movie.id]?.rating && (
                                <div className="flex items-center gap-0.5">
                                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                                  <span className="text-[10px] font-medium">
                                    {watchListNotes[movie.id].rating}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {watchList.length === 0 && watched.length === 0 && (
          <Card className="border-dashed border-2 border-border/60">
            <CardContent className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <Film className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base font-semibold mb-1">Start Your Movie Journey</h3>
              <p className="text-xs text-muted-foreground mb-4 max-w-md">
                Begin by discovering movies or searching for your favorites. Build your watchlist and track what you've watched!
              </p>
              <div className="flex gap-2">
                <Button onClick={() => navigate("/")} size="sm">
                  <TrendingUp className="mr-2 h-3 w-3" />
                  Browse Latest
                </Button>
                <Button variant="outline" onClick={() => navigate("/search")} size="sm">
                  Search Movies
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;

