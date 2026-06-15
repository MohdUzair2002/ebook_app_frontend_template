import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/profile/OrderHistory",
        destination: "/profile/orderHistory",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
