import type { NestedCompositionProjectType } from "./timeline.types";
export const PREFETCH_VIDEO_URL =
  "https://editor-uploads.s3.us-east-1.amazonaws.com/39984216-5579-4077-ba94-778429107468";
// "https://d7cjozj05bzmu.cloudfront.net/screen-new-large+(1).webm"; //720
// "https://d7cjozj05bzmu.cloudfront.net/screen-new-large-480.webm";
// "https://d7cjozj05bzmu.cloudfront.net/screen-new-large.webm";
// "https://video-serve.dev-sumitdey.workers.dev/sample-screen.mp4";
export const EMPTY_PROJECT_4: NestedCompositionProjectType = {
  id: "id-dummy",
  title: "Dummy Project",
  props: {
    layers: {
      "layer-zoom": {
        id: "layer-zoom",
        name: "Layer 1",
        liteItems: [],
        isVisible: true,
        layerType: "normal",
      },
      "layer-video": {
        id: "layer-video",
        name: "Layer 1",
        liteItems: [
          /* {
            contentType: "video",
            id: "s-video-6cae35de-69f1-4516-b9b8-f549d9d1dd04",
            offset: 0,
            sequenceDuration: 1470,
            effectiveDuration: 1470,
            sequenceType: "standalone",
            startFrame: 0,
            linkedCaptionLayerId: null,
            linkedCaptionId: null,
          }, */
        ],
        isVisible: true,
        layerType: "normal",
      },
    },
    layerOrder: ["layer-video", "layer-zoom"],
    sequenceItems: {
      "s-video-6cae35de-69f1-4516-b9b8-f549d9d1dd04": {
        id: "s-video-6cae35de-69f1-4516-b9b8-f549d9d1dd04",
        layerId: "l-51c9a7fe-8660-47f4-883f-b65a9ee2199d",
        type: "video",
        animations: [],
        totalVideoDurationInFrames: 1470,
        editableProps: {
          videoEndsAtInFrames: 1470,
          videoStartsFromInFrames: 0,
          styles: {
            container: {
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            },
            element: {
              width: "100%",
              height: "100%",
            },
            overlay: {},
          },
          positionAndDimensions: {
            top: 0,
            left: 0,
            width: 1920,
            height: 1080,
          },
          videoUrl: PREFETCH_VIDEO_URL,
          //"https://d7cjozj05bzmu.cloudfront.net/sample-screen.mp4",
          //     "https://d7cjozj05bzmu.cloudfront.net/screen-new-large.mp4",
          //"https://d7cjozj05bzmu.cloudfront.net/Screen+Recording+2025-01-13+at+9.36.13%E2%80%AFPM.mp4",
          //    "https://public-video-poc.s3.us-east-1.amazonaws.com/sample%2B1-all%2Bscreen.mp4",
          // "https://public-video-poc.s3.us-east-1.amazonaws.com/Screen+Recording+2025-01-13+at+6.16.54%E2%80%AFPM.mp4",
          //  "https://no-protection-bucket.s3.us-east-1.amazonaws.com/screen+studio/2022395-hd_1920_1080_30fps.mp4",
          // "https://no-protection-bucket.s3.us-east-1.amazonaws.com/screen+studio/sample%2B1-all%2Bscreen.mp4",

          // "https://videos.pexels.com/video-files/4829605/4829605-uhd_2560_1440_30fps.mp4",
          //  "https://buhksdehgdjohvrrolij.supabase.co/storage/v1/object/public/sample%20videos/sample%201-all%20screen.mov?t=2025-01-12T19%3A54%3A59.083Z",
          //    "https://buhksdehgdjohvrrolij.supabase.co/storage/v1/object/public/sample%20videos/Screen%20Recording%202025-01-12%20at%209.25.16%20PM.mov",
          //"https://no-protection-bucket.s3.us-east-1.amazonaws.com/screen+studio/sample%2B1-all%2Bscreen.mp4",
          // "https://no-protection-bucket.s3.us-east-1.amazonaws.com/screen+studio/2022395-hd_1920_1080_30fps.mp4",
          //  "https://videos.pexels.com/video-files/2022395/2022395-hd_1920_1080_30fps.mp4",
          //  "https://no-protection-bucket.s3.us-east-1.amazonaws.com/screen+studio/sample+1-all+screen.mov",
        },
      },
    },
    compositionMetaData: {
      width: 1920,
      height: 1080,
      fps: 30,
      duration: 1500,
      compositionId: "new-dynamic-composition",
    },
    transitions: {},
  },
};
