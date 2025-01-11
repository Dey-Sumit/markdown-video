import { Composition } from "remotion";
import { z } from "zod";
import ZoomIntoPositionComposition from ".";
import { VideoCompositionSchema } from "../types.zoom";

/**
 * Example default value for the schema
 */

export const defaultCompositionProps: z.infer<typeof VideoCompositionSchema> = {
  zoomEvents: [
    {
      startFrame: 20,
      targetX: 960,
      targetY: 540,
      zoomLevel: 2,
      stayDuration: 30,
    },
  ],
  videos: [
    {
      type: "video",
      editableProps: {
        videoUrl: "https://example.com/video.mp4",
        trimStart: 0,
        trimEnd: 300,
      },
      totalVideoDurationInFrames: 300,
    },
  ],
  styles: {
    padding: 10,
    borderRadius: 15,
    insets: 5,
  },
};

/**
 * Main Composition to define the video with a single zoom event.
 */
export const ZoomCompositionLoader: React.FC = () => {
  return (
    <Composition
      id="ZoomIntoPosition"
      component={ZoomIntoPositionComposition}
      durationInFrames={360}
      fps={30}
      width={1920}
      height={1080}
      schema={VideoCompositionSchema} // Use the updated schema
      defaultProps={defaultCompositionProps} // Use the updated default props
    />
  );
};
