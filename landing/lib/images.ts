/**
 * Фотографии-заглушки с Unsplash: блюда в макете приложения и обложки планов.
 *
 * Это временный контент до собственной съёмки. Держим ID в одном месте,
 * чтобы замена на свои изображения была одной правкой, а не поиском по JSX.
 * `alt` описывает блюдо: макеты помечены aria-hidden, но подпись останется
 * осмысленной, если картинку решат вынести в реальный интерфейс.
 */
export type Photo = { id: string; alt: string };

export const DISH: Record<string, Photo> = {
  chickenBulgur: {
    id: "photo-1504674900247-0877df9cc836",
    alt: "Курица с булгуром на тарелке",
  },
  pastaBasil: {
    id: "photo-1512621776951-a57141f2eefd",
    alt: "Паста с зеленью и базиликом",
  },
  bowl: {
    id: "photo-1490645935967-10de6ba17061",
    alt: "Салатная миска с овощами",
  },
};

export const PLAN_COVER: Record<string, Photo> = {
  weightLoss: {
    id: "photo-1546069901-ba9599a7e63c",
    alt: "Лёгкий салат — обложка плана на снижение веса",
  },
  massGain: {
    id: "photo-1540189549336-e6e99c3679fe",
    alt: "Сытная тарелка — обложка плана на набор массы",
  },
  glutenFree: {
    id: "photo-1567620905732-2d1ec7ab7445",
    alt: "Завтрак без глютена — обложка плана",
  },
};

/**
 * Unsplash отдаёт кадрированную версию по query-параметрам, поэтому не тянем
 * оригинал на несколько мегабайт ради миниатюры 96 px.
 */
export function photoUrl(photo: Photo, size: number): string {
  const params = new URLSearchParams({
    w: String(size * 2), // запас под экраны с удвоенной плотностью
    h: String(size * 2),
    fit: "crop",
    crop: "entropy",
    q: "75",
    auto: "format",
  });

  return `https://images.unsplash.com/${photo.id}?${params}`;
}
