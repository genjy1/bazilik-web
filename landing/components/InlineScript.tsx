"use client";

/**
 * Инлайн-скрипт, выполняемый браузером во время парсинга HTML — до первой
 * отрисовки и до гидратации.
 *
 * На клиенте тип подменяется на text/plain: React ругается, когда встречает
 * <script> при рендере компонента (на клиенте он всё равно не выполнится),
 * а suppressHydrationWarning гасит расхождение по самому атрибуту type.
 *
 * Компонент обязан быть клиентским: в серверном `typeof window` всегда
 * `undefined`, ветка text/plain никогда не сработает и предупреждение
 * останется.
 *
 * См. docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
