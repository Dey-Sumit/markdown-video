import nextMDX from "@next/mdx";
import { remarkCodeHike } from "codehike/mdx";
import rehypePrettyCode from "rehype-pretty-code";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // reactCompiler: true,
  },
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      {
        hostname: "images.unsplash.com",
      },
    ],
  },
  webpack: (config, {}) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    config.optimization.minimize = false;

    return config;
  },
  pageExtensions: ["js", "jsx", "mdx", "md", "ts", "tsx"],

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
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
