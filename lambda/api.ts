import type { RenderMediaOnLambdaOutput } from "@remotion/lambda/client";
import { z } from "zod";
import type { CompositionMap } from "~/helpers/use-rendering";
import type { ApiResponse } from "../helpers/api-response";
import { ProgressRequest, type ProgressResponse } from "../types/schema";

const makeRequest = async <Res>(
  endpoint: string,
  body: unknown,
): Promise<Res> => {
  const result = await fetch(endpoint, {
    method: "post",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });
  const json = (await result.json()) as ApiResponse<Res>;
  if (json.type === "error") {
    throw new Error(json.message);
  }

  return json.data;
};

export const renderVideo = async <T extends keyof CompositionMap>({
  id,
  inputProps,
}: {
  id: T;
  inputProps: CompositionMap[T];
}) => {
  // const body: z.infer<typeof RenderRequest> = {
  //   id,
  //   inputProps,
  // };
  let body: any;
  if (id === "code-transition-composition") {
    body = {
      id: "code-transition-composition",
      inputProps,
    };
  } else if (id === "new-dynamic-composition") {
    body = {
      id: "new-dynamic-composition",
      inputProps,
    };
  }

  return makeRequest<RenderMediaOnLambdaOutput>("/api/lambda/render", body);
};

export const getProgress = async ({
  id,
  bucketName,
}: {
  id: string;
  bucketName: string;
}) => {
  const body: z.infer<typeof ProgressRequest> = {
    id,
    bucketName,
  };

  return makeRequest<ProgressResponse>("/api/lambda/progress", body);
};
