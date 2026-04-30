import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sky, Stars, Cloud, Float, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

export type WorldId = "forest" | "alps" | "city" | "coast";

interface Props {
  world: WorldId;
  speed?: number; // 0..1 user pedal/intensity
}

/* ---------- Shared moving ground ---------- */
const MovingGround = ({ color, speed, texture }: { color: string; speed: number; texture?: "lines" | "grid" | "sand" | "asphalt" }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, dt) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    if (mat.map) {
      mat.map.offset.y -= dt * (0.3 + speed * 1.8);
    }
  });

  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 4;
    if (texture === "grid") {
      for (let i = 0; i < 256; i += 32) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 256); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(256, i); ctx.stroke();
      }
    } else if (texture === "asphalt") {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.fillRect(122, 20, 12, 60);
      ctx.fillRect(122, 120, 12, 60);
      ctx.fillRect(122, 220, 12, 60);
    } else {
      // lines/sand
      for (let i = 0; i < 60; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.15})`;
        ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(8, 40);
    return t;
  }, [color, texture]);

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[40, 400]} />
      <meshStandardMaterial map={map} color={color} />
    </mesh>
  );
};

/* ---------- Scrolling props (trees, rocks, buildings...) ---------- */
const ScrollingItems = ({
  count = 30,
  speed,
  build,
  spread = 8,
}: {
  count?: number;
  speed: number;
  spread?: number;
  build: (i: number) => JSX.Element;
}) => {
  const group = useRef<THREE.Group>(null);
  const items = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const z = -(i / count) * 200 + 20;
      const side = Math.random() > 0.5 ? 1 : -1;
      const x = side * (spread + Math.random() * 6);
      return { i, z, x };
    });
  }, [count, spread]);

  useFrame((_, dt) => {
    if (!group.current) return;
    group.current.children.forEach((child) => {
      child.position.z += dt * (8 + speed * 30);
      if (child.position.z > 15) child.position.z -= 200;
    });
  });

  return (
    <group ref={group}>
      {items.map((it) => (
        <group key={it.i} position={[it.x, 0, it.z]}>
          {build(it.i)}
        </group>
      ))}
    </group>
  );
};

/* ---------- Worlds ---------- */
const ForestWorld = ({ speed }: { speed: number }) => (
  <>
    <color attach="background" args={["#0a1f12"]} />
    <fog attach="fog" args={["#0a1f12", 15, 90]} />
    <hemisphereLight args={["#9be7c4", "#0a1f12", 0.6]} />
    <directionalLight position={[5, 10, 5]} intensity={1} color="#d8ffe9" />
    <Stars radius={80} depth={50} count={1200} factor={2} fade speed={0.5} />
    <MovingGround color="#1a3d24" speed={speed} texture="lines" />
    <ScrollingItems
      count={40}
      speed={speed}
      build={() => (
        <group>
          <mesh position={[0, 1.2, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.2, 2.4]} />
            <meshStandardMaterial color="#3a2a1a" />
          </mesh>
          <mesh position={[0, 3, 0]} castShadow>
            <coneGeometry args={[1.2, 3, 8]} />
            <meshStandardMaterial color="#1f6b3a" />
          </mesh>
          <mesh position={[0, 4, 0]} castShadow>
            <coneGeometry args={[0.9, 2.2, 8]} />
            <meshStandardMaterial color="#2a8c4a" />
          </mesh>
        </group>
      )}
    />
  </>
);

const AlpsWorld = ({ speed }: { speed: number }) => (
  <>
    <color attach="background" args={["#bfe3ff"]} />
    <fog attach="fog" args={["#bfe3ff", 30, 140]} />
    <Sky sunPosition={[10, 8, -20]} turbidity={2} rayleigh={1} />
    <ambientLight intensity={0.6} />
    <directionalLight position={[10, 20, 5]} intensity={1.4} color="#ffffff" />
    <MovingGround color="#e8f4ff" speed={speed} texture="asphalt" />
    {/* Distant mountains */}
    {Array.from({ length: 6 }).map((_, i) => (
      <mesh key={i} position={[(i - 3) * 20, 8, -80 - (i % 2) * 20]}>
        <coneGeometry args={[14, 22, 4]} />
        <meshStandardMaterial color={i % 2 ? "#8aa6c4" : "#6e8aa8"} flatShading />
      </mesh>
    ))}
    <ScrollingItems
      count={25}
      spread={10}
      speed={speed}
      build={(i) => (
        <mesh position={[0, 1, 0]} castShadow>
          <coneGeometry args={[1.5 + (i % 3) * 0.4, 4 + (i % 3), 4]} />
          <meshStandardMaterial color="#ffffff" flatShading />
        </mesh>
      )}
    />
  </>
);

const CityWorld = ({ speed }: { speed: number }) => (
  <>
    <color attach="background" args={["#08030f"]} />
    <fog attach="fog" args={["#1a0830", 10, 80]} />
    <ambientLight intensity={0.3} color="#ff3aa0" />
    <directionalLight position={[5, 10, 5]} intensity={0.6} color="#3CB5D3" />
    <pointLight position={[0, 5, -5]} intensity={2} color="#D31311" />
    <pointLight position={[6, 4, -10]} intensity={2} color="#3CB5D3" />
    <MovingGround color="#160828" speed={speed} texture="grid" />
    <ScrollingItems
      count={30}
      spread={9}
      speed={speed}
      build={(i) => {
        const h = 6 + ((i * 37) % 18);
        const color = i % 2 ? "#3CB5D3" : "#D31311";
        return (
          <group>
            <mesh position={[0, h / 2, 0]} castShadow>
              <boxGeometry args={[3, h, 3]} />
              <meshStandardMaterial color="#0a0518" emissive={color} emissiveIntensity={0.25} />
            </mesh>
            {Array.from({ length: Math.floor(h / 1.2) }).map((_, k) => (
              <mesh key={k} position={[1.51, 1 + k * 1.2, 0]}>
                <planeGeometry args={[0.4, 0.4]} />
                <meshBasicMaterial color={color} />
              </mesh>
            ))}
          </group>
        );
      }}
    />
  </>
);

const CoastWorld = ({ speed }: { speed: number }) => {
  const water = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!water.current) return;
    const geo = water.current.geometry as THREE.PlaneGeometry;
    const pos = geo.attributes.position;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, Math.sin(x * 0.3 + t) * 0.3 + Math.cos(y * 0.4 + t) * 0.3);
    }
    pos.needsUpdate = true;
  });
  return (
    <>
      <color attach="background" args={["#7bc8e8"]} />
      <fog attach="fog" args={["#bfe9f7", 25, 120]} />
      <Sky sunPosition={[5, 3, -10]} turbidity={4} rayleigh={3} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />
      <MovingGround color="#e8d9a8" speed={speed} texture="sand" />
      <mesh ref={water} rotation={[-Math.PI / 2, 0, 0]} position={[18, 0.05, -50]}>
        <planeGeometry args={[60, 200, 24, 64]} />
        <meshStandardMaterial color="#1f8fbf" transparent opacity={0.9} metalness={0.4} roughness={0.2} />
      </mesh>
      <ScrollingItems
        count={15}
        spread={6}
        speed={speed}
        build={() => (
          <group>
            <mesh position={[0, 2.4, 0]}>
              <cylinderGeometry args={[0.12, 0.18, 4.8]} />
              <meshStandardMaterial color="#5a3a1a" />
            </mesh>
            <mesh position={[0, 5, 0]}>
              <sphereGeometry args={[1.2, 8, 8]} />
              <meshStandardMaterial color="#2a8c4a" />
            </mesh>
          </group>
        )}
      />
      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[-12, 8, -40]}>
          <sphereGeometry args={[3, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </Float>
    </>
  );
};

const WorldRenderer = ({ world, speed }: Props) => {
  switch (world) {
    case "forest": return <ForestWorld speed={speed} />;
    case "alps": return <AlpsWorld speed={speed} />;
    case "city": return <CityWorld speed={speed} />;
    case "coast": return <CoastWorld speed={speed} />;
  }
};

const ImmersiveScene = ({ world, speed = 0.3 }: Props) => {
  return (
    <Canvas shadows camera={{ position: [0, 2.2, 6], fov: 65 }} dpr={[1, 1.5]}>
      <Suspense fallback={null}>
        <WorldRenderer world={world} speed={speed} />
      </Suspense>
    </Canvas>
  );
};

export default ImmersiveScene;
