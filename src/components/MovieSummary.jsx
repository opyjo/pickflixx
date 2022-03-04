import axios from "axios";
import React, { Component } from "react";
import YoutubeVideo from "./YoutubeVideo";
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
      videoResponse.map((video) => {
        this.setState({ video: video });
      });
    };
    search();
  }

  render() {
    return (
      <div>
        <YoutubeVideo videoKey={this.state.video.key} />
      </div>
    );
  }
}

export default MovieSummary;
