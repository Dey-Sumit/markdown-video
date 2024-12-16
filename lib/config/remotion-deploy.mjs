/**
 * Use autocomplete to get a list of available regions.
 * @type {import('@remotion/lambda').AwsRegion}
 */
const REGION = "us-east-1";

const SITE_NAME = "markdown-video";
const RAM = 2048;
const DISK = 2048;
const TIMEOUT = 60;

export const REMOTION_DEPLOY_CONFIG = {
  REGION,
  SITE_NAME,
  RAM,
  DISK,
  TIMEOUT,
};
