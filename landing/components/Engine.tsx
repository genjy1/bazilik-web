import { EngineCards } from "./EngineCards";
import { SectionKicker } from "./SectionKicker";
import { BrandScene } from "./three/BrandScene";

export function Engine() {
  return (
    <section id="engine" className="inverted relative overflow-hidden py-16 md:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[10%] -bottom-[40%] left-[30%] h-[520px]"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(53,176,110,0.16) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-6">
        <BrandScene />

        <SectionKicker
          n="02"
          title={
            <>
              Четыре механики,{" "}
              <br />
              из которых собран движок
            </>
          }
          lead="Связка «план → список → заказ» — это стол ставок, она есть у всех. Разница начинается здесь: в том, как система думает о вашей кухне между покупками."
        />

        <EngineCards />
      </div>
    </section>
  );
}
