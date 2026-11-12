"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { PLACEMENTS, WORLD, panelSize, type PanelPlacement } from "./layout";
import type { PanelCanvases } from "./use-panel-canvases";

type SceneProps = {
  canvases: PanelCanvases;
  reducedMotion: boolean;
  active: boolean;
  onReady?: () => void;
};

const easeOutExpo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

/** Shared pointer state (normalised −1…1), written by a window listener. */
function usePointer(enabled: boolean) {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);
  return pointer;
}

function Panel({
  placement,
  canvas,
  reducedMotion,
  startTime,
}: {
  placement: PanelPlacement;
  canvas: HTMLCanvasElement;
  reducedMotion: boolean;
  startTime: React.RefObject<number | null>;
}) {
  const group = useRef<THREE.Group>(null);
  const [w, h] = panelSize(placement.id);
  const depth = placement.id === "overview" ? 0.09 : 0.06;
  const gl = useThree((s) => s.gl);

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.needsUpdate = true;
    return t;
  }, [canvas, gl]);

  useEffect(() => () => texture.dispose(), [texture]);

  const phase = placement.order * 1.37;

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const [x, y, z] = placement.pos;
    if (reducedMotion) {
      g.position.set(x, y, z);
      g.scale.setScalar(1);
      return;
    }
    const t0 = startTime.current ?? state.clock.elapsedTime;
    const local = Math.max(0, state.clock.elapsedTime - t0 - placement.order * 0.12);
    const p = easeOutExpo(Math.min(1, local / 1.6));
    const t = state.clock.elapsedTime;
    const float = Math.sin(t * 0.55 + phase) * 0.045;
    g.position.set(x, y + float - (1 - p) * 0.35, z - (1 - p) * 1.6);
    g.scale.setScalar(0.92 + 0.08 * p);
    g.rotation.set(
      placement.rot[0] + Math.sin(t * 0.4 + phase) * 0.012,
      placement.rot[1] + Math.cos(t * 0.35 + phase) * 0.015,
      placement.rot[2],
    );
  });

  const bodyColor = placement.dark ? "#1a2442" : "#eef1f7";

  return (
    <group ref={group} position={placement.pos} rotation={placement.rot}>
      <RoundedBox args={[w, h, depth]} radius={Math.min(0.11, depth / 2)} smoothness={4} castShadow receiveShadow>
        <meshPhysicalMaterial
          color={bodyColor}
          roughness={placement.dark ? 0.32 : 0.42}
          metalness={placement.dark ? 0.25 : 0.05}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
        />
      </RoundedBox>
      <mesh position={[0, 0, depth / 2 + 0.002]} receiveShadow>
        <planeGeometry args={[w * 0.995, h * 0.995]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.02}
          roughness={0.38}
          metalness={0}
          emissive="#ffffff"
          emissiveMap={texture}
          emissiveIntensity={placement.dark ? 0.6 : 0.5}
          envMapIntensity={0.55}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Rig({
  children,
  reducedMotion,
}: {
  children: React.ReactNode;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const pointer = usePointer(!reducedMotion);


  useFrame((state, delta) => {
    // Fit the composition to the canvas (keeps full width visible on narrow stages).
    const cam = state.camera as THREE.PerspectiveCamera;
    const aspect = state.size.width / Math.max(1, state.size.height);
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2);
    const needH = (WORLD.halfH * 2 + 0.2) / (2 * tanHalf);
    const needW = (WORLD.halfW * 2 + 0.2) / (2 * tanHalf * aspect);
    // Wide stages bleed off-screen, so allow a little horizontal crop there.
    cam.position.z = Math.max(needH, needW * (aspect > 1.2 ? 0.9 : 1)) + 0.3;

    const g = group.current;
    if (!g) return;
    const baseY = -0.32;
    const baseX = 0.14;
    if (reducedMotion) {
      g.rotation.set(baseX, baseY, 0);
      cam.lookAt(0, 0, 0);
      return;
    }
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    const k = 1 - Math.pow(0.0015, delta); // frame-rate independent damping
    g.rotation.y += (baseY + pointer.current.x * 0.13 - g.rotation.y) * k;
    g.rotation.x += (baseX + pointer.current.y * 0.07 + scroll * 0.18 - g.rotation.x) * k;
    g.position.y += (scroll * 0.6 - g.position.y) * k;
    state.camera.position.x += (pointer.current.x * 0.25 - state.camera.position.x) * k;
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
}

function Content({ canvases, reducedMotion, onReady }: Omit<SceneProps, "active">) {
  const startTime = useRef<number | null>(null);
  const readyFired = useRef(false);

  useFrame((state) => {
    if (startTime.current === null) startTime.current = state.clock.elapsedTime;
    if (!readyFired.current) {
      readyFired.current = true;
      // Let one frame paint before revealing the canvas.
      requestAnimationFrame(() => onReady?.());
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[-4, 6, 7]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={1}
        shadow-camera-far={25}
        shadow-radius={6}
      />
      <pointLight position={[5, 2.5, -2]} intensity={30} color="#386bff" distance={14} decay={2} />
      <pointLight position={[0, 3.5, -2.5]} intensity={22} color="#7f9bff" distance={10} decay={2} />
      <pointLight position={[-5, -3, 2]} intensity={10} color="#865dff" distance={12} decay={2} />

      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, 6]} scale={[12, 3, 1]} color="#dfe6ff" />
        <Lightformer form="rect" intensity={1.4} position={[-7, 0, 3]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} color="#8ea9ff" />
        <Lightformer form="rect" intensity={1.2} position={[7, -1, 2]} rotation-y={-Math.PI / 2} scale={[8, 3, 1]} color="#b9a2ff" />
        <Lightformer form="ring" intensity={0.8} position={[0, -5, 4]} scale={4} color="#386bff" />
      </Environment>

      <Rig reducedMotion={reducedMotion}>
        {PLACEMENTS.map((p) => (
          <Panel
            key={p.id}
            placement={p}
            canvas={canvases[p.id]}
            reducedMotion={reducedMotion}
            startTime={startTime}
          />
        ))}
      </Rig>
    </>
  );
}

export default function HeroScene({ canvases, reducedMotion, active, onReady }: SceneProps) {
  return (
    <Canvas
      shadows="percentage"
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 12], fov: 30, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reducedMotion ? "demand" : active ? "always" : "never"}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        gl.setClearColor(0x000000, 0);
      }}
      aria-hidden
    >
      <Content canvases={canvases} reducedMotion={reducedMotion} onReady={onReady} />
    </Canvas>
  );
}
