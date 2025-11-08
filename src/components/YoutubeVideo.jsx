import React from "react";

const YoutubeVideo = ({ videoKey }) => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-xl"
          src={`https://www.youtube.com/embed/${videoKey}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Embedded youtube"
        />
      </div>
    </div>
  );
};

export default YoutubeVideo;
