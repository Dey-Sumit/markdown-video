import { Img, interpolate, useCurrentFrame } from "remotion";

const CompositionImage = ({
  src,
  slideDuration,
  mediaAppearanceDelay = 60,
}: {
  src: string;
  slideDuration: number;
  mediaAppearanceDelay: number;
}) => {
  const frame = useCurrentFrame();

  // 30 + 10 = 40+10 frames start
  const TRANSITION_DURATION = 10;
  const BUFFER = 15;
  const stillDuration =
    slideDuration - (mediaAppearanceDelay + 2 * TRANSITION_DURATION) - BUFFER; // for in and out transition

  const opacity = interpolate(
    frame, // Frame starts when `startAt` is reached
    [
      mediaAppearanceDelay,
      mediaAppearanceDelay + TRANSITION_DURATION,
      mediaAppearanceDelay + TRANSITION_DURATION + stillDuration,
      mediaAppearanceDelay +
        TRANSITION_DURATION +
        stillDuration +
        TRANSITION_DURATION,
    ], // Map frame range from 0 to animation duration
    [0, 1, 1, 0], // Opacity changes from `from` to `to`
    {
      extrapolateRight: "clamp", // Ensure the value stops at the end
    },
  );

  // Scale animation: from 0.9 to 1.2
  // const scale = interpolate(
  //   frame,
  //   [
  //     mediaAppearanceDelay + TRANSITION_DURATION,
  //     mediaAppearanceDelay + TRANSITION_DURATION + stillDuration,
  //   ],
  //   [1, 1.05],
  //   { extrapolateRight: "clamp" },
  // );

  // Subtle motion for X and Y axes
  const motionRange = 3; // Maximum pixel shift (adjustable)
  const motionX = Math.sin(frame / 5) * motionRange; // Change position every 10 frames
  const motionY = Math.cos(frame / 5) * motionRange; // Change position every 10frames

  // Restrict motion to the specified range
  const isMotionFrame =
    frame >= mediaAppearanceDelay + TRANSITION_DURATION &&
    frame <= mediaAppearanceDelay + TRANSITION_DURATION + stillDuration;

  const transform = isMotionFrame
    ? `translate(${motionX}px, ${motionY}px)`
    : "translate(0, 0)";

  return (
    <div
      style={{
        opacity,
        transform, // Apply the subtle motion
      }}
      className="absolute inset-0 flex items-center justify-center backdrop-blur-sm"
    >
      <Img src={src} className="h-auto w-[60%] rounded-2xl shadow-2xl" />
    </div>
  );
};
export default CompositionImage;
