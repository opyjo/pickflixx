import React, { useContext, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Calendar, Star, Play, Trash2 } from "lucide-react";
import YoutubeVideo from "./YoutubeVideo";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { GlobalContext } from "../context/GlobalState";
import { TMDB_API_BASE_URL, TMDB_API_KEY } from "../lib/tmdb";

const formatTimeLabel = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }
  const roundedSeconds = Math.floor(seconds);
  const minutes = Math.floor(roundedSeconds / 60);
  const remainingSeconds = roundedSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const MovieSummary = ({ selectedMovie }) => {
  const [videoKey, setVideoKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { resumeProgress, clearResumeProgress } = useContext(GlobalContext);

  const resumeEntry = useMemo(() => {
    if (!selectedMovie?.id) {
      return null;
    }
    return resumeProgress?.[selectedMovie.id] ?? null;
  }, [resumeProgress, selectedMovie?.id]);

  useEffect(() => {
    if (!selectedMovie?.id) {
      return;
    }

    let isCancelled = false;

    const fetchVideo = async () => {
      setLoading(true);
      setError(null);
      setVideoKey("");

      try {
        const response = await axios.get(
          `${TMDB_API_BASE_URL}/movie/${selectedMovie.id}/videos`,
          {
            params: {
              api_key: TMDB_API_KEY,
            },
          }
        );

        if (isCancelled) {
          return;
        }

        const results = response.data?.results ?? [];
        const youtubeTrailer =
          results.find(
            (video) =>
              video.site === "YouTube" && video.type === "Trailer"
          ) ??
          results.find((video) => video.site === "YouTube");

        setVideoKey(youtubeTrailer?.key ?? "");
      } catch (fetchError) {
        if (!isCancelled) {
          setError(
            fetchError?.response?.data?.status_message ??
              fetchError?.message ??
              "Unable to load trailer."
          );
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchVideo();

    return () => {
      isCancelled = true;
    };
  }, [selectedMovie?.id]);

  if (!selectedMovie) {
    return (
      <div className="container mx-auto max-w-screen-2xl px-4 py-16 text-center text-muted-foreground">
        Select a movie to see its trailer and overview.
      </div>
    );
  }

  const handleClearResume = () => {
    if (selectedMovie?.id) {
      clearResumeProgress(selectedMovie.id);
    }
  };

  return (
    <div className="container mx-auto max-w-screen-2xl px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Play className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              {selectedMovie.original_title ?? selectedMovie.title}
            </h1>
          </div>
          {resumeEntry && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearResume}
            >
              <Trash2 className="h-4 w-4" />
              Clear progress
            </Button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {selectedMovie.vote_average ? (
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              {selectedMovie.vote_average.toFixed(1)} / 10
            </span>
          ) : null}
          {selectedMovie.release_date ? (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(selectedMovie.release_date).getFullYear()}
            </span>
          ) : null}
          {resumeEntry?.timestamp ? (
            <Badge variant="secondary">
              Resume from {formatTimeLabel(resumeEntry.timestamp)}
            </Badge>
          ) : null}
        </div>

        {selectedMovie.overview ? (
          <p className="max-w-3xl text-muted-foreground">
            {selectedMovie.overview}
          </p>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-6 text-center text-destructive">
          {error}
        </div>
      ) : loading ? (
        <div className="rounded-lg border border-border/60 bg-muted/10 p-6">
          Loading trailer...
        </div>
      ) : (
        <YoutubeVideo videoKey={videoKey} movie={selectedMovie} />
      )}
    </div>
  );
};

MovieSummary.propTypes = {
  selectedMovie: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    original_title: PropTypes.string,
    overview: PropTypes.string,
    vote_average: PropTypes.number,
    release_date: PropTypes.string,
    poster_path: PropTypes.string,
    backdrop_path: PropTypes.string,
  }),
};

MovieSummary.defaultProps = {
  selectedMovie: null,
};

export default MovieSummary;
