"use client";

import Image from "next/image";
import { useRef } from "react";
import heroBg from "@/public/images/hero-bg.jpg";
import { HERO } from "@/lib/content";
import { MOTION_QUERIES, gsap, useIsomorphicLayoutEffect } from "@/lib/gsap";
import { JourneyBand } from "./JourneyBand";
import { Button } from "./ui/Button";
import { Pill } from "./ui/Chip";
import { Parallax } from "./ui/Parallax";

/**
 * Геро-блок: центрированный текст, под ним — маршрут недели.
 *
 * Композиция вертикальная, а не двухколоночная: заголовок задаёт обещание,
 * маршрут сразу его показывает. Собственный intro — единственная анимация
 * на странице, не привязанная к скроллу: блок виден сразу при загрузке,
 * и ждать прокрутки здесь нечего.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia();

    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };
      if (reduced) return;

      const q = gsap.utils.selector(el);

      gsap
        .timeline({ defaults: { ease: "power3.out", duration: 0.8 } })
        .from(q("[data-hero-line]"), { yPercent: 110, stagger: 0.09 })
        .from(q("[data-hero-lead]"), { opacity: 0, y: 18 }, "-=0.45")
        .from(q("[data-hero-cta]"), { opacity: 0, y: 16 }, "-=0.55")
        .from(q("[data-hero-pill]"), { opacity: 0, y: 12, stagger: 0.07 }, "-=0.5");

      // Параллакс на уход геро: слои разъезжаются с разной скоростью, пока
      // блок покидает экран. Общий Parallax здесь не подходит — он привязан
      // к проходу элемента через экран, а геро стартует уже наверху.
      const out = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Полоса отстаёт от прокрутки, то есть уезжает вниз. Амплитуда подобрана
      // по зазору до следующей секции: при 26% он схлопывался с 56 px до 2 px
      // и полоса почти утыкалась в строку с цифрами.
      out
        .to(q("[data-hero-copy]"), { yPercent: -18, opacity: 0.35, ease: "none" }, 0)
        .to(q("[data-hero-band]"), { yPercent: 12, ease: "none" }, 0);
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      className="relative overflow-hidden pt-16 pb-10 md:pt-24 md:pb-14"
    >
      {/* Фотография-подложка. Запас 130% с отступом −15% съедается параллаксом:
          при меньшем запасе на краях хода вылезала бы непокрытая полоса. */}
      <div aria-hidden="true" className="absolute inset-0 z-0">
        <Parallax speed={0.18} className="absolute inset-x-0 -top-[15%] h-[130%]">
          <Image
            src={heroBg}
            alt=""
            fill
            priority
            placeholder="blur"
            sizes="100vw"
            className="object-cover opacity-30"
          />
        </Parallax>

        {/* Снимок работает подложкой, а не картинкой.
            Итоговая заметность фотографии = прозрачность снимка × (1 − плотность
            вуали). Проверено на живой странице: при 0.16 и выше серый лид на
            овощах не читается, а тонкая линия маршрута с моношрифтовыми
            подписями пропадает совсем. Держим ~0.06 под текстом и ~0.09 ниже —
            снимок даёт тепло и глубину, но ни с чем не спорит.
            color-mix на токене --ground — чтобы слой работал в обеих темах. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom," +
              "var(--ground) 0%," +
              "color-mix(in srgb, var(--ground) 80%, transparent) 40%," +
              "color-mix(in srgb, var(--ground) 70%, transparent) 72%," +
              "var(--ground) 100%)",
          }}
        />

        {/* На узком экране object-cover обрезает кадр по центру, где снимок
            светлее и пестрее, поэтому лид держится хуже, чем на десктопе.
            Добавляем плотности только здесь, чтобы не трогать выверенный
            баланс широких экранов. */}
        <div className="absolute inset-0 bg-ground/25 md:hidden" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1180px] px-6">
        <div data-hero-copy>
          {/* Каждая строка едет из-под своей маски, поэтому у заголовка
              обязана быть собственная обёртка с overflow-hidden.
              Строки не переносятся: ширину диктует кегль через clamp, а любой
              перенос здесь рвал бы фразу по слогам. */}
          <h1 className="text-center text-[clamp(40px,8.6vw,104px)] leading-[0.92] tracking-[-0.055em]">
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-line className="block whitespace-nowrap">
                {HERO.titleTop}
              </span>
            </span>{" "}
            <span className="block overflow-hidden pb-[0.08em]">
              <span
                data-hero-line
                className="block whitespace-nowrap text-accent-deep"
              >
                {HERO.titleAccent}
              </span>
            </span>
          </h1>

          <p
            data-hero-lead
            className="mx-auto mt-7 max-w-[58ch] text-center text-[clamp(17px,2.1vw,20px)] text-muted"
          >
            {HERO.lead}
          </p>

          <div data-hero-cta className="mt-9 flex flex-wrap justify-center gap-3">
            <Button href="#how" withArrow>
              Как это работает
            </Button>
            <Button href="#engine" variant="secondary">
              Что внутри движка
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-2.5">
            {HERO.pills.map((p) => (
              <span key={p} data-hero-pill>
                <Pill>{p}</Pill>
              </span>
            ))}
          </div>
        </div>

        {/* Полоса маршрута требует ширины: viewBox 1200 единиц, сжатый до
            экрана телефона, превращает подписи в нечитаемые 4 px. Ниже md
            геро обходится без неё. */}
        <div data-hero-band className="mt-14 hidden md:mt-20 md:block">
          <JourneyBand />
        </div>
      </div>
    </section>
  );
}
