import { CodeTransitionCompositionPropsSchema } from "@/video/compositions/code-video-composition/types.composition";
import { z } from "zod";

export const RenderRequest = z.discriminatedUnion("id", [
  z.object({
    id: z.literal("code-transition-composition"),
    inputProps: CodeTransitionCompositionPropsSchema,
  }),
  //   z.object({
  //     id: z.literal("new-dynamic-composition"),
  //     inputProps: NestedCompositionPropsSchema,
  //   }),
  // Add more compositions as needed
]);

export const ProgressRequest = z.object({
  bucketName: z.string(),
  id: z.string(),
});

export type ProgressResponse =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "progress";
      progress: number;
    }
  | {
      type: "done";
      url: string;
      size: number;
    };
