import {
  getRenderProgress,
  speculateFunctionName,
  type AwsRegion,
} from "@remotion/lambda/client";
import { REMOTION_DEPLOY_CONFIG } from "@/lib/config/remotion-deploy.mjs";
import { executeApi } from "@/app/remotion-lambda-deploy/utils";
import {
  ProgressRequest,
  type ProgressResponse,
} from "@/app/remotion-lambda-deploy/schema";
const { REGION, RAM, DISK, TIMEOUT } = REMOTION_DEPLOY_CONFIG;

export const POST = executeApi<ProgressResponse, typeof ProgressRequest>(
  ProgressRequest,
  async (req, body) => {
    const renderProgress = await getRenderProgress({
      bucketName: body.bucketName,
      functionName: speculateFunctionName({
        diskSizeInMb: DISK,
        memorySizeInMb: RAM,
        timeoutInSeconds: TIMEOUT,
      }),
      region: REGION as AwsRegion,
      renderId: body.id,
    });

    if (renderProgress.fatalErrorEncountered) {
      return {
        type: "error",
        message: renderProgress.errors[0].message,
      };
    }

    if (renderProgress.done) {
      return {
        type: "done",
        url: renderProgress.outputFile as string,
        size: renderProgress.outputSizeInBytes as number,
      };
    }

    return {
      type: "progress",
      progress: Math.max(0.03, renderProgress.overallProgress),
    };
  },
);
