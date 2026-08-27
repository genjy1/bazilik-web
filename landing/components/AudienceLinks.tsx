import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AUDIENCE_ROUTES } from "@/lib/content";
import { Reveal } from "./ui/Reveal";

/**
 * Развилка «для кого»: специалисты (b2b2c) и дома (b2c) — разные страницы,
 * здесь только вход на каждую. Сама аудиторская подача (чек-листы, панель
 * интерфейса) живёт на /specialists и на главной (/).
 */
export function AudienceLinks() {
  return (
    <section id="audience" className="py-16 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <Reveal>
          <div className="eyebrow">Для кого</div>
        </Reveal>

        <Reveal delay={60}>
          <h2 className="mt-3.5 max-w-[22ch] text-[clamp(28px,4.4vw,48px)] tracking-[-0.045em]">
            Один план — два разных сценария
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-4 max-w-[62ch] text-[clamp(16px,2vw,19px)] text-muted">
            План питания выглядит по-разному в зависимости от того, кто его
            собирает и кто по нему живёт.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {AUDIENCE_ROUTES.map((route, i) => (
            <Reveal key={route.href} delay={180 + i * 60}>
              <Link
                href={route.href}
                className="group flex h-full flex-col rounded-[clamp(20px,3vw,30px)] border border-line bg-surface p-7 transition-colors duration-200 hover:border-accent md:p-9"
              >
                <div className="eyebrow">{route.eyebrow}</div>
                <h3 className="mt-3.5 text-[clamp(22px,2.8vw,28px)]">
                  {route.title}
                </h3>
                <p className="mt-3.5 max-w-[46ch] text-[15.5px] text-muted">
                  {route.body}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold tracking-tight text-accent-deep">
                  Как это работает
                  <ArrowRight
                    size={17}
                    strokeWidth={2.4}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
