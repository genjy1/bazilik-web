"use client";

// Только типы: значения three.js подтягиваются динамическим import() внутри
// эффекта, чтобы тяжёлый чанк не попадал в первый рендер. Type-only импорт
// стирается сборкой и живёт в отдельном от рантайм-переменной пространстве имён.
import type * as THREE from "three";
import { useRef } from "react";
import { ASSEMBLY } from "@/lib/content";
import {
  MOTION_QUERIES,
  ScrollTrigger,
  gsap,
  useIsomorphicLayoutEffect,
} from "@/lib/gsap";

/* ============================================================
   Скролл-сборка «продукты → блюдо → план» — главная механика.

   Одна закреплённая (pin) сцена, прогресс которой прокрутка гоняет от 0 до 1.
   Всё — положение 3D-продуктов, цифры КБЖУ, строки списка покупок — это чистая
   функция прогресса, поэтому скролл назад разбирает блюдо ровно так же, как
   вперёд его собирал. Никаких односторонних твинов, состояние не «залипает».

   Производительность (главное требование к анимации):
   • three.js грузится динамически и только когда секция подходит к экрану —
     тяжёлый чанк не висит в первом рендере;
   • кадр рисуется по требованию, из onUpdate ScrollTrigger. Пока не скроллят —
     ни одного лишнего requestAnimationFrame, GPU простаивает;
   • при prefers-reduced-motion сцена не закрепляется и рисуется один раз в
     собранном виде, а КБЖУ и список показаны статично.
   ============================================================ */

type V3 = [number, number, number];

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerp3 = (a: V3, b: V3, t: number): V3 => [
  lerp(a[0], b[0], t),
  lerp(a[1], b[1], t),
  lerp(a[2], b[2], t),
];
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
/** Линейный ремап в [0,1] с отсечкой по краям. */
const remap = (v: number, a: number, b: number) => clamp01((v - a) / (b - a));
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Хореография одного продукта: откуда влетает (from), где ложится на тарелку
 * (to), куда распадается (out) и на каких участках прогресса это происходит.
 */
type Move = {
  from: V3;
  to: V3;
  out: V3;
  fromRot: V3;
  toRot: V3;
  outRot: V3;
  toScale: number;
  enter: [number, number];
  exit: [number, number];
};

const MOVES: Record<"tomato" | "chicken" | "basil" | "meat", Move> = {
  // Помидор — из верхнего левого угла.
  tomato: {
    from: [-4.6, 3.4, 0.6],
    to: [-0.42, 0.16, 0.18],
    out: [-2.6, 2.6, -1.2],
    fromRot: [1.2, 0.8, 2.0],
    toRot: [0, 0.3, 0],
    outRot: [1.4, 1.0, 2.2],
    toScale: 1,
    enter: [0.08, 0.4],
    exit: [0.62, 0.86],
  },
  // Курица — из нижнего левого.
  chicken: {
    from: [-4.8, -3.2, 0.8],
    to: [0.34, 0.1, -0.02],
    out: [-2.4, 2.2, -1.2],
    fromRot: [0.8, -1.0, 0.6],
    toRot: [0, -0.4, 0],
    outRot: [1.0, -1.2, 0.8],
    toScale: 1,
    enter: [0.1, 0.44],
    exit: [0.64, 0.88],
  },
  // Базилик — из верхнего правого.
  basil: {
    from: [4.6, 3.2, 0.5],
    to: [0.05, 0.3, 0.42],
    out: [2.4, 2.8, -1.2],
    fromRot: [0.6, -0.9, -1.4],
    toRot: [-0.3, 0.2, 0.1],
    outRot: [0.8, -1.1, -1.6],
    toScale: 1,
    enter: [0.14, 0.48],
    exit: [0.66, 0.9],
  },
  // Пачка фарша — из нижнего правого.
  meat: {
    from: [4.8, -2.8, 0.6],
    to: [-0.1, 0.14, -0.4],
    out: [2.6, 2.4, -1.2],
    fromRot: [-0.9, 1.1, 0.7],
    toRot: [0, 0.5, 0],
    outRot: [-1.1, 1.3, 0.9],
    toScale: 0.82,
    enter: [0.18, 0.52],
    exit: [0.68, 0.92],
  },
};

/** Цвет точки-маркера у плитки КБЖУ. */
const MACRO_DOT: Record<string, string> = {
  kcal: "bg-accent",
  protein: "bg-herb",
  fat: "bg-amber",
  carbs: "bg-gold",
};

export function RecipeAssembly() {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!root || !stage || !host) return;

    // ---- узлы наложения (обновляем textContent/style напрямую, без setState) ----
    const macros = Array.from(root.querySelectorAll<HTMLElement>("[data-macro]"));
    const shopRows = Array.from(root.querySelectorAll<HTMLElement>("[data-shop]"));
    const capRaw = root.querySelector<HTMLElement>('[data-cap="raw"]');
    const capDish = root.querySelector<HTMLElement>('[data-cap="dish"]');
    const capPlan = root.querySelector<HTMLElement>('[data-cap="plan"]');
    const progressFill = root.querySelector<HTMLElement>("[data-progress]");
    const panel = root.querySelector<HTMLElement>("[data-plan-panel]");

    /** Наложение (КБЖУ, список, подписи, полоса времени) как функция прогресса. */
    function applyOverlay(p: number) {
      const plan = easeOut(remap(p, 0.6, 0.92));
      for (const el of macros) {
        const target = Number(el.dataset.target) || 0;
        const value = el.querySelector<HTMLElement>("[data-macro-value]");
        if (value) value.textContent = String(Math.round(target * plan));
      }
      shopRows.forEach((el, i) => {
        const rf = easeOut(remap(p, 0.64 + i * 0.03, 0.76 + i * 0.03));
        el.style.opacity = String(rf);
        el.style.transform = `translateY(${(1 - rf) * 10}px)`;
      });
      if (capRaw) capRaw.style.opacity = String(1 - remap(p, 0.4, 0.5));
      if (capDish)
        capDish.style.opacity = String(
          remap(p, 0.44, 0.52) * (1 - remap(p, 0.58, 0.66)),
        );
      if (capPlan) capPlan.style.opacity = String(remap(p, 0.6, 0.7));
      if (panel) panel.style.opacity = String(remap(p, 0.54, 0.66));
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
      // Скруглённые коробки (лоток фарша) — из jsm, тоже отдельным чанком.
      const { RoundedBoxGeometry } = await import(
        "three/examples/jsm/geometries/RoundedBoxGeometry.js"
      );
      if (disposed) return;

      const geos: THREE.BufferGeometry[] = [];
      const mats: THREE.Material[] = [];
      const track = <T,>(item: T, bin: T[]) => (bin.push(item), item);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      camera.position.set(0, 1.55, 5.4);
      camera.lookAt(0, 0.25, 0);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearAlpha(0);

      const canvas = renderer.domElement;
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      host!.appendChild(canvas);

      // Небо сверху — тёплая земля снизу: мягкая объёмная база под все продукты.
      scene.add(new THREE.HemisphereLight(0xffffff, 0x3a2a1c, 0.7));
      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      // Ключевой свет даёт бликам форму, заполняющий снимает провалы в тенях.
      const key = new THREE.DirectionalLight(0xfff4e6, 2.2);
      key.position.set(3, 5, 3);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xffffff, 0.55);
      fill.position.set(-2.5, 1.5, 4);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0x8fd6a6, 1.2);
      rim.position.set(-3, 1, -2);
      scene.add(rim);

      const dishGroup = new THREE.Group();
      scene.add(dishGroup);

      // --- тарелка: диск + чуть утопленное дно, чтобы читался объём ---
      const plateMat = track(
        new THREE.MeshStandardMaterial({
          color: 0xf3efe6,
          roughness: 0.3,
          metalness: 0.02,
          transparent: true,
        }),
        mats,
      );
      const wellMat = track(
        new THREE.MeshStandardMaterial({
          color: 0xe7e1d4,
          roughness: 0.35,
          transparent: true,
        }),
        mats,
      );
      const plate = new THREE.Mesh(
        track(new THREE.CylinderGeometry(1.2, 1.02, 0.09, 56), geos),
        plateMat,
      );
      const well = new THREE.Mesh(
        track(new THREE.CylinderGeometry(0.92, 0.92, 0.02, 48), geos),
        wellMat,
      );
      well.position.y = 0.05;
      dishGroup.add(plate, well);
      const plateMats = [plateMat, wellMat];

      // --- продукты: каждый — группа с собственным набором материалов ---
      type Item = { group: THREE.Group; mats: THREE.Material[]; move: Move };
      const items: Item[] = [];

      const stdMat = (color: number, roughness: number, extra = {}) =>
        track(
          new THREE.MeshStandardMaterial({
            color,
            roughness,
            transparent: true,
            ...extra,
          }),
          mats,
        );
      // Физический материал — для глянца (кожица томата, плёнка на лотке).
      const physMat = (params: THREE.MeshPhysicalMaterialParameters) =>
        track(new THREE.MeshPhysicalMaterial({ transparent: true, ...params }), mats);

      // Обход вершин геометрии — общая обёртка для «лепки» форм.
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
        const bodyGeo = track(new THREE.SphereGeometry(0.34, 40, 28), geos);
        sculpt(bodyGeo, (v) => {
          v.y *= 0.84; // приплюснуть по вертикали
          // ямка у верхнего полюса, куда садится чашелистик
          const top = Math.max(0, (v.y - 0.12) / 0.18);
          v.y -= top * top * 0.05;
        });
        const bodyMat = physMat({
          color: 0xd63a29,
          roughness: 0.24,
          clearcoat: 0.7,
          clearcoatRoughness: 0.28,
        });
        g.add(new THREE.Mesh(bodyGeo, bodyMat));

        // Пять зелёных лепестков звездой + короткий черешок.
        const calyxMat = stdMat(0x4f8a3c, 0.55);
        const calyxGeo = track(new THREE.ConeGeometry(0.055, 0.17, 4), geos);
        for (let i = 0; i < 5; i++) {
          const pivot = new THREE.Group();
          pivot.rotation.y = (i / 5) * Math.PI * 2;
          pivot.position.y = 0.235;
          const leaf = new THREE.Mesh(calyxGeo, calyxMat);
          leaf.position.set(0, 0.02, 0.075);
          leaf.rotation.x = 1.15; // распластать наружу
          leaf.scale.set(1, 1, 0.5);
          pivot.add(leaf);
          g.add(pivot);
        }
        const stemMat = stdMat(0x6f5a2e, 0.7);
        const stem = new THREE.Mesh(
          track(new THREE.CylinderGeometry(0.02, 0.028, 0.08, 6), geos),
          stemMat,
        );
        stem.position.y = 0.29;
        g.add(stem);

        dishGroup.add(g);
        items.push({
          group: g,
          mats: [bodyMat, calyxMat, stemMat],
          move: MOVES.tomato,
        });
      }

      // Куриное филе — шар, растянутый и сужающийся к носу (форма грудки).
      {
        const g = new THREE.Group();
        const R = 0.3;
        const geo = track(new THREE.SphereGeometry(R, 32, 22), geos);
        sculpt(geo, (v) => {
          const nx = v.x / R; // −1 хвост .. +1 нос
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
            depth: 0.02,
            bevelEnabled: true,
            bevelThickness: 0.006,
            bevelSize: 0.006,
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
          const ty = (v.y - bb.min.y) / hgt; // 0 черешок .. 1 кончик
          v.z += Math.pow(ty, 1.6) * 0.13; // загиб кончика вперёд
          v.z -= (Math.abs(v.x) / halfW) * 0.05; // срединная складка
        });

        const leafMat = stdMat(0x3f9d4a, 0.42, { side: THREE.DoubleSide });
        const stemMat = stdMat(0x4a7a35, 0.6);
        const g = new THREE.Group();
        const stem = new THREE.Mesh(
          track(new THREE.CylinderGeometry(0.01, 0.018, 0.3, 6), geos),
          stemMat,
        );
        stem.position.y = -0.12;
        g.add(stem);
        (
          [
            [0, 0.1, 0, 0, 0, 0.6],
            [-0.02, 0.0, 0.02, 22, -24, 0.5],
            [0.02, 0.0, 0.02, -22, 24, 0.5],
            [-0.03, -0.1, -0.01, 46, -40, 0.42],
            [0.03, -0.1, -0.01, -46, 40, 0.42],
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

      // Пачка фарша — пенопластовый лоток, зернистый фарш и глянцевая плёнка.
      {
        const g = new THREE.Group();
        const trayMat = stdMat(0xece7db, 0.85);
        const tray = new THREE.Mesh(
          track(new RoundedBoxGeometry(0.74, 0.16, 0.52, 4, 0.045), geos),
          trayMat,
        );
        tray.position.y = -0.02;
        g.add(tray);

        const meatGeo = track(new RoundedBoxGeometry(0.62, 0.2, 0.42, 5, 0.07), geos);
        sculpt(meatGeo, (v) => {
          if (v.y <= 0.02) return;
          // мелкая бугристость сверху — «прокрученный» вид
          const n = Math.sin(v.x * 47) * Math.cos(v.z * 51) + Math.sin(v.z * 29);
          v.y += n * 0.012;
          v.x += Math.sin(v.z * 40) * 0.006;
        });
        const meatMat = stdMat(0x9c2f27, 0.72);
        const meat = new THREE.Mesh(meatGeo, meatMat);
        meat.position.y = 0.08;
        g.add(meat);

        const filmMat = physMat({
          color: 0xffffff,
          roughness: 0.12,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
          opacity: 0.14,
        });
        filmMat.depthWrite = false;
        filmMat.userData.baseOpacity = 0.14;
        const film = new THREE.Mesh(
          track(new RoundedBoxGeometry(0.76, 0.03, 0.54, 3, 0.03), geos),
          filmMat,
        );
        film.position.y = 0.185;
        g.add(film);

        const labelMat = stdMat(0xf6f2e9, 0.5);
        const label = new THREE.Mesh(
          track(new THREE.BoxGeometry(0.22, 0.012, 0.15), geos),
          labelMat,
        );
        label.position.set(-0.19, 0.2, 0.13);
        g.add(label);

        dishGroup.add(g);
        items.push({
          group: g,
          mats: [trayMat, meatMat, filmMat, labelMat],
          move: MOVES.meat,
        });
      }

      dishGroup.rotation.x = -0.06;

      applyScene = (p: number) => {
        // Тарелка появляется первой, к концу сцены растворяется.
        const plateScale = easeOut(remap(p, 0.04, 0.3));
        plate.scale.setScalar(plateScale || 0.0001);
        well.scale.setScalar(plateScale || 0.0001);
        const plateOpacity =
          remap(p, 0.04, 0.12) * (1 - remap(p, 0.74, 0.97));
        for (const m of plateMats) m.opacity = plateOpacity;

        // Собранное блюдо медленно доворачивается по мере скролла — жизнь без
        // отдельного цикла анимации.
        dishGroup.rotation.y = -0.15 + easeInOut(remap(p, 0.42, 1)) * 0.6;

        for (const { group, mats: gm, move } of items) {
          const inT = easeInOut(remap(p, move.enter[0], move.enter[1]));
          const outT = easeInOut(remap(p, move.exit[0], move.exit[1]));

          const pos =
            outT > 0
              ? lerp3(move.to, move.out, outT)
              : lerp3(move.from, move.to, inT);
          const rot =
            outT > 0
              ? lerp3(move.toRot, move.outRot, outT)
              : lerp3(move.fromRot, move.toRot, inT);
          const scale =
            outT > 0 ? lerp(move.toScale, move.toScale * 0.7, outT) : move.toScale;

          group.position.set(pos[0], pos[1], pos[2]);
          group.rotation.set(rot[0], rot[1], rot[2]);
          group.scale.setScalar(scale);

          const inFade = remap(p, move.enter[0], move.enter[0] + 0.04);
          const outFade = 1 - remap(p, move.exit[0], move.exit[1]);
          const opacity = Math.min(inFade, outFade);
          // Базовая прозрачность материала (плёнка ≈ 0.14) сохраняется —
          // fade лишь домножает её, а не делает плёнку непрозрачной.
          for (const m of gm)
            m.opacity = opacity * ((m.userData.baseOpacity as number) ?? 1);
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
        applyScene(isReduced() ? 0.5 : progress);
      }

      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host!);

      // Первая отрисовка под текущий режим и пересчёт закрепления: высота
      // спейсера pin от загрузки сцены не зависит, но refresh не повредит.
      applyScene(isReduced() ? 0.5 : progress);
      ScrollTrigger.refresh();

      disposeScene = () => {
        ro.disconnect();
        for (const g of geos) g.dispose();
        for (const m of mats) m.dispose();
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
        // Без движения: собранное блюдо + полностью раскрытые КБЖУ и список.
        applyOverlay(1);
        applyScene(0.5);
        return;
      }

      const st = ScrollTrigger.create({
        trigger: stage,
        start: "top top",
        end: () => "+=" + window.innerHeight * 3,
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

      applyOverlay(0);

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
    <section ref={rootRef} id="assembly" className="inverted relative">
      <div
        ref={stageRef}
        className="relative h-screen w-full overflow-hidden bg-ground"
      >
        {/* Слой WebGL. */}
        <div ref={hostRef} className="absolute inset-0" aria-hidden="true" />

        {/* Тёплое сияние снизу — глубина под сценой. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
          style={{
            background:
              "radial-gradient(60% 80% at 50% 100%, rgba(53,176,110,0.16) 0%, transparent 70%)",
          }}
        />

        {/* Наложение: текст, полоса времени и панель плана. Декоративно —
            перехватывать курсор не должно. */}
        <div className="pointer-events-none absolute inset-0">
          <div className="mx-auto flex h-full max-w-[1180px] flex-col px-6">
            <header className="pt-20 md:pt-24">
              <span className="eyebrow">{ASSEMBLY.eyebrow}</span>
              <h2 className="mt-3 max-w-[15ch] text-[clamp(28px,4.4vw,50px)]">
                {ASSEMBLY.title}
              </h2>
              <p className="mt-3 max-w-[44ch] text-[15px] text-muted">
                {ASSEMBLY.lead}
              </p>

              {/* Полоса времени: скролл = время готовки. */}
              <div className="mt-6 flex items-center gap-3">
                <div className="h-[3px] w-44 overflow-hidden rounded-full bg-line">
                  <div
                    data-progress
                    className="h-full origin-left bg-accent"
                    style={{ transform: "scaleX(0)" }}
                  />
                </div>
                <div className="relative h-5 flex-1 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-deep">
                  <span data-cap="raw" className="absolute left-0">
                    {ASSEMBLY.captions.raw}
                  </span>
                  <span
                    data-cap="dish"
                    className="absolute left-0"
                    style={{ opacity: 0 }}
                  >
                    {ASSEMBLY.captions.dish}
                  </span>
                  <span
                    data-cap="plan"
                    className="absolute left-0"
                    style={{ opacity: 0 }}
                  >
                    {ASSEMBLY.captions.plan}
                  </span>
                </div>
              </div>
            </header>

            <div className="flex-1" />

            {/* Панель плана: проявляется, когда блюдо распадается в данные. */}
            <div
              data-plan-panel
              className="mb-14 ml-auto w-full max-w-[420px] md:mb-16"
            >
              <div className="rounded-3xl border border-line bg-surface/90 p-5 shadow-[0_18px_44px_rgba(0,0,0,0.28)]">
                <div className="mb-4 flex items-center justify-between gap-3 border-b border-line pb-3.5">
                  <div className="text-[15px] font-extrabold tracking-tight">
                    {ASSEMBLY.dish}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
                    порция
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {ASSEMBLY.macros.map((m) => (
                    <div
                      key={m.key}
                      data-macro
                      data-target={m.value}
                      className="rounded-2xl border border-line bg-ground px-3.5 py-3"
                    >
                      <div className="flex items-baseline gap-2">
                        <span
                          aria-hidden="true"
                          className={`size-1.5 rounded-full ${MACRO_DOT[m.key]}`}
                        />
                        <span
                          data-macro-value
                          className="text-[26px] font-extrabold tracking-tight tabular-nums"
                        >
                          {m.value}
                        </span>
                      </div>
                      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wide text-muted">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                <ul className="mt-3 flex flex-col gap-1.5">
                  {ASSEMBLY.shopping.map((s) => (
                    <li
                      key={s.name}
                      data-shop
                      className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ground px-3.5 py-2"
                    >
                      <span className="text-[14px] font-bold tracking-tight">
                        {s.name}
                      </span>
                      <span className="font-mono text-[11px] tracking-wide text-muted">
                        {s.qty}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
