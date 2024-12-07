import React from "react";

const compositionMetaData = {
  fps: 30,
  height: 1080,
  width: 1920,
};

const XPlayer = () => {
  return (
    <div
      className="bg-red-400 text-white"
      style={{
        aspectRatio: `${compositionMetaData.width} / ${compositionMetaData.height}`,
      }}
    >
      HELLO
    </div>
  );
};

export default XPlayer;
