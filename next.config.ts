import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["react-apexcharts", "apexcharts", "better-auth"],
  async rewrites() {
    return [
      { source: '/api/docs', destination: '/docs' },
      { source: '/api/docs/', destination: '/docs' },
    ];
  },
  // Turbopack: alias a subpath del paquete (no ruta absoluta; Turbopack no soporta server relative imports).
  turbopack: {
    resolveAlias: {
      "better-auth/client": "better-auth/dist/client/index.mjs",
      "better-auth/react": "better-auth/dist/client/react/index.mjs",
    },
  },
  // Webpack: require.resolve para que funcione en Docker y local.
  webpack: (config) => {
    config.resolve.alias = config.resolve.alias || {};
    try {
      config.resolve.alias["better-auth/client"] = require.resolve("better-auth/dist/client/index.mjs");
      config.resolve.alias["better-auth/react"] = require.resolve("better-auth/dist/client/react/index.mjs");
    } catch {
      const root = path.resolve(process.cwd());
      config.resolve.alias["better-auth/client"] = path.join(root, "node_modules/better-auth/dist/client/index.mjs");
      config.resolve.alias["better-auth/react"] = path.join(root, "node_modules/better-auth/dist/client/react/index.mjs");
    }
    return config;
  },
};

export default nextConfig;
