"use client";

// Только типы: значения three.js подтягиваются динамическим import() внутри
// эффекта — та же схема, что и в RecipeAssembly.tsx, чтобы тяжёлый чанк не
// попадал в первый рендер /home.
import type * as THREE from "three";
import { useRef } from "react";
import { HOME } from "@/lib/content";
import {
  MOTION_QUERIES,
  ScrollTrigger,
  clamp01,
  easeOut,
  gsap,
  remap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";
import { SectionKicker } from "./SectionKicker";

/* ============================================================
   «Как это работает» — сцена сборки блюда для /home.

   Раньше это была 2D-версия (DOM/SVG) главной механики RecipeAssembly.tsx.
   Теперь сцена тоже на three.js: те же приёмы (лепка вершин, PBR-материалы,
   PMREM-окружение), тот же жизненный цикл (динамическая загрузка чанка по
   IntersectionObserver, кадр по требованию из onUpdate ScrollTrigger), но
   свой, более короткий pin и свой набор продуктов — без разбора блюда обратно
   в КБЖУ (эта раскладка уже есть в GoalsSection ниже по странице).

   Прогресс 0..1 гоняет всё как чистую функцию — обратимо, как и в
   RecipeAssembly: скролл назад ровно так же разбирает сцену, как вперёд её
   собирал.
   ============================================================ */

type V3 = [number, number, number];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];

/** Хореография одного продукта: откуда влетает и где ложится на тарелку. */
type Move = {
  from: V3;
  to: V3;
  fromRot: V3;
  toRot: V3;
  toScale: number;
  enter: [number, number];
};

const MOVES: Record<"tomato" | "chicken" | "basil" | "garlic", Move> = {
  tomato: {
    from: [-3.6, 2.7, 0.6],
    to: [-0.32, 0.14, 0.18],
    fromRot: [1.0, 0.6, 1.6],
    toRot: [0, 0.3, 0],
    toScale: 1,
    enter: [0.52, 0.72],
  },
  chicken: {
    from: [3.8, 2.5, 0.6],
    to: [0.3, 0.1, -0.05],
    fromRot: [0.7, -0.8, 0.5],
    toRot: [0, -0.35, 0],
    toScale: 1,
    enter: [0.56, 0.76],
  },
  basil: {
    from: [-3.4, -2.5, 0.5],
    to: [0.02, 0.28, 0.32],
    fromRot: [0.5, -0.7, -1.2],
    toRot: [-0.25, 0.2, 0.1],
    toScale: 1,
    enter: [0.6, 0.8],
  },
  garlic: {
    from: [3.6, -2.3, 0.6],
    to: [-0.06, 0.16, -0.3],
    fromRot: [-0.7, 0.9, 0.6],
    toRot: [0, 0.4, 0],
    toScale: 0.85,
    enter: [0.64, 0.84],
  },
};

const SHOPPING = ["Куриное филе", "Помидоры", "Базилик", "Чеснок"];

export function DishAssemblyScene() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!root || !stage || !host) return;

    const shopRows = Array.from(root.querySelectorAll<HTMLElement>("[data-shop]"));
    const steam = root.querySelector<HTMLElement>("[data-steam]");
    const captions = Array.from(root.querySelectorAll<HTMLElement>("[data-caption]"));
    const progressFill = root.querySelector<HTMLElement>("[data-progress]");

    /** Наложение (подписи шагов, список покупок, полоса времени, пар). */
    function applyOverlay(p: number) {
      shopRows.forEach((el, i) => {
        const rf = remap(p, 0.16 + i * 0.06, 0.3 + i * 0.06);
        el.style.opacity = String(rf);
        el.style.transform = `translateX(${(1 - rf) * -10}px)`;
        const check = el.querySelector<HTMLElement>("[data-check]");
        if (check) check.style.opacity = String(remap(p, 0.2 + i * 0.06, 0.34 + i * 0.06));
      });

      if (steam) steam.style.opacity = String(remap(p, 0.86, 1));

      captions.forEach((el, i) => {
        const third = 1 / captions.length;
        const start = i * third;
        const end = start + third;
        const fade = Math.min(remap(p, start, start + 0.06), 1 - remap(p, end - 0.06, end));
        el.style.opacity = String(i === captions.length - 1 ? remap(p, start, start + 0.06) : fade);
      });

      if (progressFill) progressFill.style.transform = `scaleX(${clamp01(p)})`;
    }

    const isReduced = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let progress = 0;
    let disposed = false;

    // applyScene заменяется настоящей реализацией, когда чанк three.js
    // догрузится; до этого — пустышка, чтобы onUpdate не падал.
    let applyScene: (p: number) => void = () => {};
    let disposeScene: () => void = () => {};
    let building = false;

    async function buildScene() {
      if (building || disposed) return;
      building = true;

      const THREE = await import("three");
      const { RoomEnvironment } = await import(
        "three/examples/jsm/environments/RoomEnvironment.js"
      );
      if (disposed) return;

      const geos: THREE.BufferGeometry[] = [];
      const mats: THREE.Material[] = [];
      const textures: THREE.Texture[] = [];
      const track = <T,>(item: T, bin: T[]) => (bin.push(item), item);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 1.4, 5.2);
      camera.lookAt(0, 0.2, 0);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearAlpha(0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1;

      const canvas = renderer.domElement;
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      host!.appendChild(canvas);

      // PMREM-окружение — то же обоснование, что и в RecipeAssembly: без него
      // глянец кожицы томата и восковая шкурка чеснока читаются плоской заливкой.
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envScene = new RoomEnvironment();
      const envMap = track(pmrem.fromScene(envScene, 0.04).texture, textures);
      scene.environment = envMap;
      envScene.dispose();
      pmrem.dispose();

      scene.add(new THREE.HemisphereLight(0xffffff, 0x3a2a1c, 0.35));
      scene.add(new THREE.AmbientLight(0xffffff, 0.12));
      const key = new THREE.DirectionalLight(0xfff4e6, 1.5);
      key.position.set(3, 5, 3);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xffffff, 0.4);
      fill.position.set(-2.5, 1.5, 4);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0x8fd6a6, 0.75);
      rim.position.set(-3, 1, -2);
      scene.add(rim);

      const dishGroup = new THREE.Group();
      scene.add(dishGroup);

      // --- тарелка: неглубокое точёное блюдце, а не миска — сцена компактнее,
      // чем в RecipeAssembly, поэтому и посуда мельче и проще.
      const plateMat = track(
        new THREE.MeshStandardMaterial({
          color: 0xf6f1e6,
          roughness: 0.45,
          metalness: 0.02,
          transparent: true,
          envMapIntensity: 0.55,
        }),
        mats,
      );
      const plateProfile = [
        [0.0, -0.02],
        [0.6, -0.018],
        [0.75, -0.008],
        [0.82, 0.012],
        [0.85, 0.024],
        [0.82, 0.03],
        [0.7, 0.018],
        [0.0, 0.014],
      ].map(([r, y]) => new THREE.Vector2(r, y));
      const plate = new THREE.Mesh(
        track(new THREE.LatheGeometry(plateProfile, 48), geos),
        plateMat,
      );
      dishGroup.add(plate);

      type Item = { group: THREE.Group; mats: THREE.Material[]; move: Move };
      const items: Item[] = [];

      const stdMat = (color: number, roughness: number, extra = {}) =>
        track(
          new THREE.MeshStandardMaterial({
            color,
            roughness,
            transparent: true,
            envMapIntensity: 0.5,
            ...extra,
          }),
          mats,
        );
      const physMat = (params: THREE.MeshPhysicalMaterialParameters) =>
        track(
          new THREE.MeshPhysicalMaterial({
            transparent: true,
            envMapIntensity: 0.5,
            ...params,
          }),
          mats,
        );

      const sculpt = (
        geo: THREE.BufferGeometry,
        fn: (v: THREE.Vector3) => void,
      ) => {
        const attr = geo.attributes.position;
        const v = new THREE.Vector3();
        for (let i = 0; i < attr.count; i++) {
          v.fromBufferAttribute(attr, i);
          fn(v);
          attr.setXYZ(i, v.x, v.y, v.z);
        }
        attr.needsUpdate = true;
        geo.computeVertexNormals();
      };

      // Помидор — приплюснутая глянцевая кожица с ямкой и звёздочкой чашелистика.
      {
        const g = new THREE.Group();
        const bodyGeo = track(new THREE.SphereGeometry(0.32, 36, 26), geos);
        sculpt(bodyGeo, (v) => {
          v.y *= 0.84;
          const top = Math.max(0, (v.y - 0.11) / 0.17);
          v.y -= top * top * 0.05;
        });
        const bodyMat = physMat({
          color: 0xd63a29,
          roughness: 0.24,
          clearcoat: 0.7,
          clearcoatRoughness: 0.28,
        });
        g.add(new THREE.Mesh(bodyGeo, bodyMat));

        const calyxMat = stdMat(0x4f8a3c, 0.55);
        const calyxGeo = track(new THREE.ConeGeometry(0.05, 0.16, 4), geos);
        for (let i = 0; i < 5; i++) {
          const pivot = new THREE.Group();
          pivot.rotation.y = (i / 5) * Math.PI * 2;
          pivot.position.y = 0.22;
          const leaf = new THREE.Mesh(calyxGeo, calyxMat);
          leaf.position.set(0, 0.02, 0.07);
          leaf.rotation.x = 1.15;
          leaf.scale.set(1, 1, 0.5);
          pivot.add(leaf);
          g.add(pivot);
        }
        const stemMat = stdMat(0x6f5a2e, 0.7);
        const stem = new THREE.Mesh(
          track(new THREE.CylinderGeometry(0.018, 0.026, 0.075, 6), geos),
          stemMat,
        );
        stem.position.y = 0.27;
        g.add(stem);

        dishGroup.add(g);
        items.push({ group: g, mats: [bodyMat, calyxMat, stemMat], move: MOVES.tomato });
      }

      // Куриное филе — шар, растянутый и сужающийся к носу (форма грудки).
      {
        const g = new THREE.Group();
        const R = 0.28;
        const geo = track(new THREE.SphereGeometry(R, 30, 20), geos);
        sculpt(geo, (v) => {
          const nx = v.x / R;
          v.x *= 1.7;
          v.y *= 0.44;
          v.z *= 0.92;
          const taper = 1 - Math.max(0, nx) * 0.6 - Math.max(0, -nx) * 0.12;
          v.y *= taper;
          v.z *= taper;
        });
        const mat = physMat({
          color: 0xe7cfa4,
          roughness: 0.62,
          clearcoat: 0.25,
          clearcoatRoughness: 0.5,
        });
        g.add(new THREE.Mesh(geo, mat));
        dishGroup.add(g);
        items.push({ group: g, mats: [mat], move: MOVES.chicken });
      }

      // Базилик — веточка: лист из кривой знака, изогнутый и со срединной складкой.
      {
        const shape = new THREE.Shape();
        const k = 1 / 52;
        shape.moveTo(0, 0);
        shape.bezierCurveTo(-13 * k, 10 * k, -14 * k, 36 * k, 0, 52 * k);
        shape.bezierCurveTo(14 * k, 36 * k, 13 * k, 10 * k, 0, 0);
        const leafGeo = track(
          new THREE.ExtrudeGeometry(shape, {
            depth: 0.018,
            bevelEnabled: true,
            bevelThickness: 0.005,
            bevelSize: 0.005,
            bevelSegments: 1,
            curveSegments: 16,
          }),
          geos,
        );
        leafGeo.center();
        leafGeo.computeBoundingBox();
        const bb = leafGeo.boundingBox!;
        const hgt = bb.max.y - bb.min.y;
        const halfW = Math.max(Math.abs(bb.min.x), Math.abs(bb.max.x)) || 1;
        sculpt(leafGeo, (v) => {
          const ty = (v.y - bb.min.y) / hgt;
          v.z += Math.pow(ty, 1.6) * 0.12;
          v.z -= (Math.abs(v.x) / halfW) * 0.045;
        });

        const leafMat = stdMat(0x3f9d4a, 0.42, { side: THREE.DoubleSide });
        const stemMat = stdMat(0x4a7a35, 0.6);
        const g = new THREE.Group();
        const stem = new THREE.Mesh(
          track(new THREE.CylinderGeometry(0.009, 0.016, 0.26, 6), geos),
          stemMat,
        );
        stem.position.y = -0.1;
        g.add(stem);
        (
          [
            [0, 0.09, 0, 0, 0, 0.56],
            [-0.018, 0.0, 0.018, 22, -24, 0.46],
            [0.018, 0.0, 0.018, -22, 24, 0.46],
            [-0.026, -0.09, -0.008, 46, -40, 0.38],
            [0.026, -0.09, -0.008, -46, 40, 0.38],
          ] as const
        ).forEach(([x, y, z, rz, ry, s]) => {
          const leaf = new THREE.Mesh(leafGeo, leafMat);
          leaf.position.set(x, y, z);
          leaf.rotation.set(0, (ry * Math.PI) / 180, (rz * Math.PI) / 180);
          leaf.scale.setScalar(s);
          g.add(leaf);
        });
        dishGroup.add(g);
        items.push({ group: g, mats: [leafMat, stemMat], move: MOVES.basil });
      }

      // Чеснок — луковица: сфера, сужающаяся к макушке в лёгкий кончик, с
      // продольными рёбрами от долек и зелёным ростком сверху.
      {
        const g = new THREE.Group();
        const R = 0.24;
        const bulbGeo = track(new THREE.SphereGeometry(R, 32, 24), geos);
        sculpt(bulbGeo, (v) => {
          const ny = v.y / R; // -1 донце .. 1 макушка
          const taper = ny > 0 ? 1 - ny * 0.32 : 1 - Math.abs(ny) * 0.12;
          v.x *= taper;
          v.z *= taper;
          if (ny > 0.55) {
            const tip = (ny - 0.55) / 0.45;
            v.x *= 1 - tip * 0.55;
            v.z *= 1 - tip * 0.55;
            v.y += tip * tip * 0.045;
          }
          // Рёбра долек — синусоида по углу вокруг вертикальной оси,
          // затухающая у полюсов, чтобы не ломать сфероид на макушке/донце.
          const angle = Math.atan2(v.z, v.x);
          const ridge = Math.sin(angle * 9) * 0.012 * (1 - Math.min(1, Math.abs(ny)));
          const len = Math.hypot(v.x, v.z) || 1;
          v.x += (v.x / len) * ridge;
          v.z += (v.z / len) * ridge;
        });
        const bulbMat = physMat({
          color: 0xf3ede0,
          roughness: 0.5,
          clearcoat: 0.15,
          clearcoatRoughness: 0.5,
        });
        g.add(new THREE.Mesh(bulbGeo, bulbMat));

        const sproutMat = stdMat(0x7a8f5a, 0.6);
        const sprout = new THREE.Mesh(
          track(new THREE.ConeGeometry(0.028, 0.09, 6), geos),
          sproutMat,
        );
        sprout.position.y = R * 0.98;
        sprout.rotation.z = 0.12;
        g.add(sprout);

        dishGroup.add(g);
        items.push({ group: g, mats: [bulbMat, sproutMat], move: MOVES.garlic });
      }

      dishGroup.rotation.x = -0.05;

      applyScene = (p: number) => {
        const plateScale = easeOut(remap(p, 0.5, 0.86));
        plate.scale.setScalar(plateScale || 0.0001);
        plateMat.opacity = remap(p, 0.5, 0.6);

        dishGroup.rotation.y = -0.1 + easeOut(remap(p, 0.5, 1)) * 0.3;

        for (const { group, mats: gm, move } of items) {
          const t = easeOut(remap(p, move.enter[0], move.enter[1]));
          const pos = lerp3(move.from, move.to, t);
          const rot = lerp3(move.fromRot, move.toRot, t);

          group.position.set(pos[0], pos[1], pos[2]);
          group.rotation.set(rot[0], rot[1], rot[2]);
          group.scale.setScalar(move.toScale);

          const opacity = remap(p, move.enter[0], move.enter[0] + 0.04);
          for (const m of gm) m.opacity = opacity;
        }

        renderer.render(scene, camera);
      };

      function resize() {
        const w = host!.clientWidth;
        const h = host!.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        applyScene(isReduced() ? 1 : progress);
      }

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host!);

      applyScene(isReduced() ? 1 : progress);
      ScrollTrigger.refresh();

      disposeScene = () => {
        ro.disconnect();
        for (const g of geos) g.dispose();
        for (const m of mats) m.dispose();
        for (const t of textures) t.dispose();
        renderer.dispose();
        canvas.remove();
      };
    }

    // Тяжёлый three.js подтягиваем только когда секция подходит к экрану.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          buildScene();
        }
      },
      { rootMargin: "60% 0px" },
    );
    io.observe(root);

    const mm = gsap.matchMedia();
    mm.add(MOTION_QUERIES, (ctx) => {
      const { reduced } = ctx.conditions as { reduced: boolean };

      if (reduced) {
        applyOverlay(1);
        applyScene(1);
        return;
      }

      applyOverlay(0);

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => "+=" + window.innerHeight * 1.4,
        pin: stage,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress = self.progress;
          applyOverlay(progress);
          applyScene(progress);
        },
        onRefresh: (self) => {
          progress = self.progress;
          applyOverlay(progress);
          applyScene(progress);
        },
      });

      return () => st.kill();
    });

    return () => {
      disposed = true;
      io.disconnect();
      mm.revert();
      disposeScene();
    };
  }, []);

  return (
    <section ref={rootRef} id="how" className="relative">
      <div ref={stageRef} className="relative h-screen w-full overflow-hidden bg-ground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 100%, rgba(53,176,110,0.16) 0%, transparent 70%)",
          }}
        />

        <div className="relative mx-auto flex h-full max-w-[1180px] flex-col px-6">
          <header className="pt-20 md:pt-24">
            <SectionKicker n="04" title="Три шага — и неделя спланирована" />

            <div className="relative mt-6 h-6 max-w-[52ch]">
              {HOME.process.map((step, i) => (
                <p
                  key={step.caption}
                  data-caption
                  className="absolute inset-x-0 top-0 text-[15px] text-muted"
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  {step.caption}
                </p>
              ))}
            </div>

            <div className="mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-line">
              <div data-progress className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
            </div>
          </header>

          <div className="relative flex-1">
            {/* Слой WebGL — тарелка и продукты. */}
            <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />

            <div
              data-steam
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-1/2 h-8 w-10 -translate-x-1/2 -translate-y-[160%] rounded-full bg-white/10 blur-md"
              style={{ opacity: 0 }}
            />
          </div>

          {/* Список покупок. */}
          <div className="mb-14 ml-auto w-full max-w-[280px] md:mb-16">
            <ul className="flex flex-col gap-1.5">
              {SHOPPING.map((name) => (
                <li
                  key={name}
                  data-shop
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface/90 px-3.5 py-2 opacity-0"
                >
                  <span className="text-[13.5px] font-bold tracking-tight">{name}</span>
                  <span data-check className="text-herb opacity-0">
                    ✓
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
