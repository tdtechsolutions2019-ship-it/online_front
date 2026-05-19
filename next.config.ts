import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // ✅ Faster dev compilation
  experimental: {
    preloadEntriesOnStart: true,   // pre-warms routes on dev server start
    optimizePackageImports: [       // tree-shake heavy packages
      "react-toastify",
      "flatpickr",
      "lucide-react",               // remove if not used
      "@heroicons/react",           // remove if not used
    ],
  },

  // ✅ SVG support for both Webpack and Turbopack
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },

};

export default nextConfig;