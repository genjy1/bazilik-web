import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Фотографии блюд и обложки планов — заглушки с Unsplash до появления
    // собственного контента. remotePatterns обязателен: без него next/image
    // откажется оптимизировать внешний хост.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
