import { RenderRequest } from "@/app/remotion-lambda-deploy/schema";
import { executeApi } from "@/app/remotion-lambda-deploy/utils";
import {
  type AwsRegion,
  renderMediaOnLambda,
  type RenderMediaOnLambdaOutput,
  speculateFunctionName,
} from "@remotion/lambda/client";
import { REMOTION_DEPLOY_CONFIG } from "@/lib/config/remotion-deploy.mjs";
const { REGION, RAM, DISK, TIMEOUT, SITE_NAME } = REMOTION_DEPLOY_CONFIG;

export const POST = executeApi<RenderMediaOnLambdaOutput, typeof RenderRequest>(
  RenderRequest,
  async (req, body) => {
    if (
      !process.env.AWS_ACCESS_KEY_ID &&
      !process.env.REMOTION_AWS_ACCESS_KEY_ID
    ) {
      throw new TypeError(
        "Set up Remotion Lambda to render videos. See the README.md for how to do so.",
      );
    }
    if (
      !process.env.AWS_SECRET_ACCESS_KEY &&
      !process.env.REMOTION_AWS_SECRET_ACCESS_KEY
    ) {
      throw new TypeError(
        "The environment variable REMOTION_AWS_SECRET_ACCESS_KEY is missing. Add it to your .env file.",
      );
    }

    const result = await renderMediaOnLambda({
      codec: "h264",
      functionName: speculateFunctionName({
        diskSizeInMb: DISK,
        memorySizeInMb: RAM,
        timeoutInSeconds: TIMEOUT,
      }),
      region: REGION as AwsRegion,
      serveUrl: SITE_NAME,
      composition: body.id,
      inputProps: body.inputProps,
      framesPerLambda: undefined,
      downloadBehavior: {
        type: "download",
        fileName: "video.mp4",
      },
      logLevel: "verbose",
      concurrencyPerLambda: 2,
      colorSpace: "bt709",
    });

    return result;
  },
);
