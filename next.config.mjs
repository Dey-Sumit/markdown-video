import nextMDX from "@next/mdx";
import { remarkCodeHike } from "codehike/mdx";
import rehypePrettyCode from "rehype-pretty-code";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    return config;
  },
  pageExtensions: ["js", "jsx", "mdx", "md", "ts", "tsx"],

  typescript: {
    ignoreBuildErrors: true,
  },
};

const prettyCodeOptions = {
  theme: "github-dark",
  // Optional: Enable line numbers
  keepBackground: true,
  // Optional: Set grid background
  grid: false,
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [[remarkCodeHike, { theme: "nord" }]],
    rehypePlugins: [[rehypePrettyCode, prettyCodeOptions]],
  },
});

export default withMDX(nextConfig);
