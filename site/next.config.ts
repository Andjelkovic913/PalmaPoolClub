import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The dev-mode route indicator floats over the bottom-left of every page,
   * which lands on top of the footer in review screenshots. Compile and
   * runtime errors are still surfaced with this off.
   */
  devIndicators: false,
};

export default nextConfig;
