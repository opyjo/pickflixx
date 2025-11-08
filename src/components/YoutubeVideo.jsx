import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import { GlobalContext } from "../context/GlobalState";
import { buildPosterUrl } from "../lib/tmdb";
import { Skeleton } from "./ui/skeleton";

const YOUTUBE_API_SCRIPT_ID = "youtube-iframe-api";
const YOUTUBE_API_SRC = "https://www.youtube.com/iframe_api";
const PROGRESS_INTERVAL_MS = 5000;

const ensureYouTubeApi = () => {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  if (window.YT && typeof window.YT.Player === "function") {
    return Promise.resolve(window.YT);
  }

  if (!window._youtubeApiPromise) {
    window._youtubeApiPromise = new Promise((resolve) => {
      const existingScript = document.getElementById(YOUTUBE_API_SCRIPT_ID);

      if (!existingScript) {
        const script = document.createElement("script");
        script.id = YOUTUBE_API_SCRIPT_ID;
        script.src = YOUTUBE_API_SRC;
        document.body.appendChild(script);
      }

      const previousHandler = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previousHandler === "function") {
          previousHandler();
        }
        resolve(window.YT);
      };
    });
  }

  return window._youtubeApiPromise;
};

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const wholeSeconds = Math.floor(seconds);
  const minutes = Math.floor(wholeSeconds / 60);
  const remainingSeconds = wholeSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const YoutubeVideo = ({ videoKey, movie }) => {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const progressTimerRef = useRef(null);
  const [playerReady, setPlayerReady] = useState(false);

  const {
    resumeProgress,
    setResumeProgress,
    clearResumeProgress,
  } = useContext(GlobalContext);

  const resumeEntry = movie?.id ? resumeProgress?.[movie.id] : null;
  const resumeTimestamp = resumeEntry?.timestamp ?? 0;
  const resumeDuration = resumeEntry?.duration ?? 0;

  const startAtRef = useRef(resumeEntry?.timestamp ?? 0);

  useEffect(() => {
    startAtRef.current = resumeEntry?.timestamp ?? 0;
  }, [movie?.id, resumeEntry?.timestamp]);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !videoKey ||
      !containerRef.current ||
      !movie?.id
    ) {
      return undefined;
    }

    let isMounted = true;

    const startProgressTimer = (player) => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
      }
      progressTimerRef.current = window.setInterval(() => {
        const currentTime = player.getCurrentTime?.() ?? 0;
        const duration = player.getDuration?.() ?? 0;

        if (Number.isFinite(duration) && duration > 0) {
          setResumeProgress(movie, { timestamp: currentTime, duration });
        }
      }, PROGRESS_INTERVAL_MS);
    };

    const stopProgressTimer = () => {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    };

    const handlePlayerStateChange = (event) => {
      const player = event.target;
      const playerState = window.YT?.PlayerState ?? {};

      if (event.data === playerState.PLAYING) {
        startProgressTimer(player);
      }

      if (
        event.data === playerState.PAUSED ||
        event.data === playerState.BUFFERING
      ) {
        stopProgressTimer();
        const currentTime = player.getCurrentTime?.() ?? 0;
        const duration = player.getDuration?.() ?? 0;
        if (Number.isFinite(duration) && duration > 0) {
          setResumeProgress(movie, { timestamp: currentTime, duration });
        }
      }

      if (event.data === playerState.ENDED) {
        stopProgressTimer();
        clearResumeProgress(movie.id);
      }
    };

      const handlePlayerReady = (event) => {
        setPlayerReady(true);
        const startingPoint = startAtRef.current ?? 0;
        if (startingPoint > 0) {
          event.target.seekTo(startingPoint, true);
        }
    };

    const initializePlayer = async () => {
      const YT = await ensureYouTubeApi();
      if (!isMounted || !YT?.Player || !containerRef.current) {
        return;
      }

      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      playerRef.current = new YT.Player(containerRef.current, {
        videoId: videoKey,
          playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
          start: Math.floor(startAtRef.current ?? 0),
        },
        events: {
          onReady: handlePlayerReady,
          onStateChange: handlePlayerStateChange,
        },
      });
    };

    initializePlayer();

    return () => {
      isMounted = false;
      stopProgressTimer();
      if (playerRef.current) {
        const currentTime = playerRef.current.getCurrentTime?.() ?? 0;
        const duration = playerRef.current.getDuration?.() ?? 0;
        if (
          Number.isFinite(duration) &&
          duration > 0 &&
          currentTime > 0 &&
          currentTime < duration
        ) {
          setResumeProgress(movie, { timestamp: currentTime, duration });
        }
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoKey, movie, setResumeProgress, clearResumeProgress]);

  if (!videoKey) {
    return (
      <div className="w-full max-w-5xl mx-auto rounded-lg border border-border/60 bg-muted/20 p-8 text-center text-muted-foreground">
        Trailer not available.
      </div>
    );
  }

  const posterUrl =
    buildPosterUrl(movie?.backdrop_path, "w780") ??
    buildPosterUrl(movie?.poster_path, "w500");

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative w-full overflow-hidden rounded-lg shadow-xl" style={{ paddingBottom: "56.25%" }}>
        <div
          ref={containerRef}
          className="absolute inset-0 h-full w-full bg-black"
        />
        {!playerReady && (
          <div className="absolute inset-0">
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={movie?.original_title ?? "Movie poster"}
                className="h-full w-full object-cover"
              />
            ) : (
              <Skeleton className="h-full w-full" />
            )}
            {resumeTimestamp > 0 && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-col items-center rounded-full bg-black/70 px-4 py-2 text-xs text-white">
                <span>Resume from {formatTime(resumeTimestamp)}</span>
              </div>
            )}
          </div>
        )}
        {playerReady && resumeDuration > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full bg-primary"
              style={{
                width: `${Math.min(
                  100,
                  (resumeTimestamp / resumeDuration) * 100
                ).toFixed(2)}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

YoutubeVideo.propTypes = {
  videoKey: PropTypes.string,
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string,
    original_title: PropTypes.string,
    poster_path: PropTypes.string,
    backdrop_path: PropTypes.string,
  }).isRequired,
};

YoutubeVideo.defaultProps = {
  videoKey: undefined,
};

export default YoutubeVideo;
