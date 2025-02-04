import type { COMMON_ANIMATIONS } from "@/components/x-editor/plugins/text";
import { interpolate } from "remotion";

export type CommonAnimationType = (typeof COMMON_ANIMATIONS)[number];

export const animationConfig: Record<
  CommonAnimationType,
  (
    frame: number,
    delay: number,
    duration: number,
  ) => { transform?: string; opacity?: number }
> = {
  //   fadeIn: (frame, delay, duration) => {
  //     const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
  //       extrapolateRight: "clamp",
  //     });
  //     return { opacity };
  //   },
  scaleIn: (frame, delay, duration) => {
    const scale = interpolate(frame, [delay, delay + duration], [0.8, 1], {
      extrapolateRight: "clamp",
    });
    return { transform: `scale(${scale})` };
  },
  none: () => ({}),

  //   slideLeft: (frame, delay, duration) => {
  //     const translateX = interpolate(frame, [delay, delay + duration], [200, 0], {
  //       extrapolateRight: "clamp",
  //     });
  //     return { transform: `translateX(${translateX}px)` };
  //   },
  //   slideRight: (frame, delay, duration) => {
  //     const translateX = interpolate(
  //       frame,
  //       [delay, delay + duration],
  //       [-200, 0],
  //       {
  //         extrapolateRight: "clamp",
  //       },
  //     );
  //     return { transform: `translateX(${translateX}px)` };
  //   },
  //   slideUp: (frame, delay, duration) => {
  //     const translateY = interpolate(frame, [delay, delay + duration], [200, 0], {
  //       extrapolateRight: "clamp",
  //     });
  //     return { transform: `translateY(${translateY}px)` };
  //   },
  //   slideDown: (frame, delay, duration) => {
  //     const translateY = interpolate(
  //       frame,
  //       [delay, delay + duration],
  //       [-200, 0],
  //       {
  //         extrapolateRight: "clamp",
  //       },
  //     );
  //     return { transform: `translateY(${translateY}px)` };
  //   },
  //   popIn: (frame, delay, duration) => {
  //     const scale = interpolate(
  //       frame,
  //       [delay, delay + duration / 2, delay + duration],
  //       [0.5, 1.2, 1],
  //       { extrapolateRight: "clamp" },
  //     );
  //     return { transform: `scale(${scale})` };
  //   },

  // New Combined Animations
  fadeInSlideDown: (frame, delay, duration) => {
    const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
      extrapolateRight: "clamp",
    });
    const translateY = interpolate(
      frame,
      [delay, delay + duration],
      [-200, 0],
      {
        extrapolateRight: "clamp",
      },
    );
    return { opacity, transform: `translateY(${translateY}px)` };
  },

  //   fadeInScale: (frame, delay, duration) => {
  //     const opacity = interpolate(frame, [delay, delay + duration], [0, 1], {
  //       extrapolateRight: "clamp",
  //     });
  //     const scale = interpolate(frame, [delay, delay + duration], [0.8, 1], {
  //       extrapolateRight: "clamp",
  //     });
  //     return { opacity, transform: `scale(${scale})` };
  //   },
};
