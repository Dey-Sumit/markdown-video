import { enableTailwind } from "@remotion/tailwind";

import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";

// TODO : it's been repeated multiple times, we should move it to a common place
const chConfig = {
  syntaxHighlighting: {
    theme: "github-dark",
  },
};

const enableMdx = async (currentConfiguration) => {
  const { remarkCodeHike, recmaCodeHike } = await import("codehike/mdx");
  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        ...(currentConfiguration.module?.rules
          ? currentConfiguration.module.rules
          : []),
        {
          test: /\.mdx?$/,
          use: [
            {
              loader: "@mdx-js/loader",
              options: {
                remarkPlugins: [[remarkCodeHike, chConfig]],
                recmaPlugins: [[recmaCodeHike, chConfig]],
              },
            },
          ],
        },
      ],
    },
  };
};

// Override the default Webpack configuration
export const webpackOverride = async (currentConfig) => {
  let config = enableTailwind(currentConfig);
  config = await enableMdx(config);
  return {
    ...config,
    resolve: {
      ...config.resolve,
      // Add the TsconfigPathsPlugin to resolve TypeScript paths
      plugins: [...(config.resolve?.plugins ?? []), new TsconfigPathsPlugin()],
    },
  };
};
