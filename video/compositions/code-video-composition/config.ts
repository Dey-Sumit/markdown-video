// export const MAX_TOKEN_TRANSITION_DURATION_IN_SECONDS = 3;
export const CODE_COMP_TRANSITION_DURATION_IN_SECONDS = 0.9;
export const FALLBACK_COMPOSITION_DURATION_IN_SECONDS = 5;

export const compositionMetaData = {
  fps: 30,
  height: 1080,
  width: 720,
};

export const FALLBACK_PROPS_RAW_FORMAT = {
  sceneMeta: "--title= --duration=3", // no name and default duration of 3 seconds
  transition: "--name=magic --duration=0.3", // default transition magic with duration of 0.3 seconds
  fonts: "--family=arial --size=16 --weight=400", // default font arial, size 16px, weight 400
  media: "--src= --type= --duration=", // default media image with duration of 1 second
};
