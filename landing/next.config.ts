import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Контент страницы «Дома» переехал на корень, поэтому старый адрес
   * отдаёт постоянный 308 на `/`: внешние ссылки и поисковая выдача,
   * накопленные на /home, не должны упираться в 404.
   */
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      /**
       * `/index` Next отдаёт как корень со статусом 200: дубль главной под
       * другим адресом. Canonical его и так склеивает, но редирект честнее —
       * робот не тратит обход на второй URL того же документа.
       */
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
    ];
  },

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
