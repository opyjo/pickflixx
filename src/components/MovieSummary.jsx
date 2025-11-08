import axios from "axios";
import React, { Component } from "react";
import YoutubeVideo from "./YoutubeVideo";
import { Badge } from "./ui/badge";
import { Calendar, Star, Play } from "lucide-react";

const IMGPATH = "https://image.tmdb.org/t/p/w1280";

class MovieSummary extends Component {
  state = { video: [] };

  componentDidMount() {
    const search = async () => {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${this.props.selectedMovie.id}/videos?`,
        {
          params: {
            api_key: "cdec2f2873bb826dad1cc5da665e4326",
          },
        }
      );
      const videoResponse = response.data.results;
      if (videoResponse.length > 0) {
        this.setState({ video: videoResponse[0] });
      }
    };
    search();
  }

  render() {
    const { selectedMovie } = this.props;

    return (
      <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Play className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{selectedMovie.original_title}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {selectedMovie.vote_average && (
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold">{selectedMovie.vote_average.toFixed(1)}</span>
              </div>
            )}
            {selectedMovie.release_date && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(selectedMovie.release_date).getFullYear()}</span>
              </div>
            )}
          </div>

          {selectedMovie.overview && (
            <p className="text-muted-foreground max-w-3xl mb-6">
              {selectedMovie.overview}
            </p>
          )}
        </div>

        {this.state.video.key ? (
          <YoutubeVideo videoKey={this.state.video.key} />
        ) : (
          <div className="text-center py-16 bg-muted rounded-lg">
            <Play className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Trailer not available</p>
          </div>
        )}
      </div>
    );
  }
}

export default MovieSummary;
