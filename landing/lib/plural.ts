/**
 * Русское склонение по числу: `plural(n, ["поход", "похода", "походов"])`.
 *
 * Формы — «один», «два–четыре», «пять и больше»; 11–14 всегда берут третью,
 * поэтому 21 → «поход», 22 → «похода», 12 → «походов». Дробное число
 * управляет родительным падежом единственного числа — «1,5 похода»,
 * «0,5 продукта», — то есть всегда второй формой. Общий хелпер для подписей
 * конфигуратора и экранов телефона — раньше каждый писал свой.
 */
export function plural(n: number, [one, few, many]: readonly [string, string, string]): string {
  if (Number.isFinite(n) && !Number.isInteger(n)) return few;

  const abs = Math.abs(n);
  const tail10 = abs % 10;
  const tail100 = abs % 100;
  if (tail10 === 1 && tail100 !== 11) return one;
  if (tail10 >= 2 && tail10 <= 4 && (tail100 < 12 || tail100 > 14)) return few;
  return many;
}
