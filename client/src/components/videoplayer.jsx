import React from 'react';
import ReactPlayer from 'react-player';

const VideoPlayer = () => {
  const videoUrl = 'https://www.youtube.com/watch?v=co4_ahEDCho';

  return (
    <div className="video-player">
      <h1>My Video Player</h1>
      <ReactPlayer url={videoUrl} />
    </div>
  );
};

export default VideoPlayer;
