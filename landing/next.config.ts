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
    ];
  },

  /**
   * В корне репозитория лежит второй package-lock.json, и без явного корня
   * Next на каждой сборке гадает, где проект, и предупреждает об этом.
   */
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
