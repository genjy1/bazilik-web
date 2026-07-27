"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * Знак «Базилик» в объёме: те же три листа, что и в плоском логотипе,
 * выдавленные из общей кривой Безье и медленно вращающиеся.
 *
 * Кривая взята из бренд-бука (path листа `M50 72 C 37 62 36 36 50 20 …`) и
 * пересчитана в систему координат three.js: начало в основании листа,
 * ось Y направлена вверх, длина нормирована в единицу.
 */
function leafShape(): THREE.Shape {
  const s = new THREE.Shape();
  const k = 1 / 52; // длина листа в SVG — 52 единицы

  s.moveTo(0, 0);
  s.bezierCurveTo(-13 * k, 10 * k, -14 * k, 36 * k, 0, 52 * k);
  s.bezierCurveTo(14 * k, 36 * k, 13 * k, 10 * k, 0, 0);

  return s;
}

const DEG = Math.PI / 180;

export function BrandMark3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.5, 3.4);
    camera.lookAt(0, 0.45, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    // Выше 2 прирост качества незаметен, а стоимость растёт квадратично.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearAlpha(0);
    // ACES + физически корректная экспозиция — без этого PBR-материалы
    // выглядят пластиково плоскими даже с окружением.
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    host.appendChild(canvas);

    // PMREM-окружение даёт материалам блики и отражения окружения —
    // без него глянец листа читается как плоская заливка, а не воск.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const envMap = pmrem.fromScene(room, 0.04).texture;
    scene.environment = envMap;
    room.dispose();
    pmrem.dispose();

    const geometry = new THREE.ExtrudeGeometry(leafShape(), {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.018,
      bevelSegments: 5,
      curveSegments: 32,
    });
    geometry.center();

    const outer = new THREE.MeshPhysicalMaterial({
      color: 0x1f7a4d,
      roughness: 0.42,
      metalness: 0.05,
      clearcoat: 0.6,
      clearcoatRoughness: 0.28,
      envMapIntensity: 0.55,
    });
    const inner = new THREE.MeshPhysicalMaterial({
      color: 0x12583a,
      roughness: 0.36,
      metalness: 0.06,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      envMapIntensity: 0.55,
    });

    const group = new THREE.Group();

    // Те же три листа и те же углы разворота, что в плоском знаке.
    ([-42, 0, 42] as const).forEach((deg) => {
      const mesh = new THREE.Mesh(geometry, deg === 0 ? inner : outer);
      mesh.position.y = 0.5;
      mesh.rotation.z = deg * DEG;
      // Боковые листья чуть уходят вглубь — так объём читается с фронта.
      mesh.position.z = deg === 0 ? 0.06 : -0.05;
      group.add(mesh);
    });

    group.rotation.x = -0.12;
    scene.add(group);

    // Заполняющий свет теперь в основном даёт PMREM-окружение — прямые
    // источники приглушены, чтобы не удваивать засветку и не смывать блики
    // в ровную яркость.
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(2.5, 3.5, 2.5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x9bb169, 0.8);
    rim.position.set(-3, -1, -2);
    scene.add(rim);

    let raf = 0;
    let sized = false;
    let onScreen = true;

    // THREE.Clock объявлен устаревшим в пользу Timer. Timer накапливает время
    // только в момент update(), поэтому пауза цикла не даёт скачка анимации,
    // а connect(document) гасит гигантскую дельту после возврата на вкладку.
    const timer = new THREE.Timer();
    timer.connect(document);

    function render() {
      renderer.render(scene, camera);
    }

    function resize() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      if (!w || !h) return;

      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      sized = true;

      // Без цикла анимации новый размер сам себя не перерисует, и канвас
      // остался бы пустым — поэтому кадр рисуем прямо здесь.
      if (reduced || !raf) render();
    }

    function frame(timestamp?: number) {
      raf = requestAnimationFrame(frame);
      timer.update(timestamp);
      const t = timer.getElapsed();
      group.rotation.y = t * 0.22;
      group.position.y = Math.sin(t * 0.6) * 0.06;
      render();
    }

    function start() {
      if (raf || reduced || !sized) return;
      frame();
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    // Не жжём кадры, пока сцена за пределами экрана или вкладка скрыта.
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen && !document.hidden) start();
      else stop();
    });
    io.observe(host);

    function onVisibility() {
      if (document.hidden) stop();
      else if (onScreen) start();
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      timer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      geometry.dispose();
      outer.dispose();
      inner.dispose();
      envMap.dispose();
      renderer.dispose();
      canvas.remove();
    };
  }, []);

  return <div ref={hostRef} className="size-full" aria-hidden="true" />;
}

export default BrandMark3D;
