import React from "react";
import { VideoWrapper } from "./styles/YoutubeVideo.styled";
import { Wrapper } from "./styles/Global.styled";

const YoutubeVideo = ({ videoKey }) => {
  return (
    <Wrapper>
      <VideoWrapper>
        <iframe
          src={`https://www.youtube.com/embed/${videoKey}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </VideoWrapper>
    </Wrapper>
  );
};

export default YoutubeVideo;
