import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { ImSpinner2 } from 'react-icons/im';

// Nested Model Loader
function Model({ modelUrl }) {
  const { scene } = useGLTF(modelUrl);
  return <primitive object={scene} dispose={null} />;
}

// Fallback loader to render inside Canvas
function CanvasLoader() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#0d9488" wireframe />
    </mesh>
  );
}

export default function ThreeDViewer({
  modelUrl,
  autoRotate = true,
  enableZoom = true,
  className = '',
}) {
  return (
    <div className={`relative w-full h-full min-h-[300px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 ${className}`}>
      {/* 3D Canvas rendering space */}
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={<CanvasLoader />}>
          {modelUrl ? (
            <Stage environment="city" intensity={0.6} adjustCamera={true}>
              <Model modelUrl={modelUrl} />
            </Stage>
          ) : (
            // Render a rotating wireframe box if no URL is provided
            <group>
              <mesh>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshStandardMaterial color="#14b8a6" wireframe roughness={0.1} metalness={0.8} />
              </mesh>
            </group>
          )}
        </Suspense>

        <OrbitControls
          enableZoom={enableZoom}
          enablePan={false}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {/* Dynamic Instruction Overlay */}
      <div className="absolute bottom-4 left-4 z-10 flex gap-2">
        <span className="px-2.5 py-1 rounded bg-black/60 border border-slate-800 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs select-none">
          🖰 Left-Click & Drag to Rotate
        </span>
        <span className="px-2.5 py-1 rounded bg-black/60 border border-slate-800 text-white text-[9px] font-bold uppercase tracking-wider backdrop-blur-xs select-none">
          📜 Scroll to Zoom
        </span>
      </div>
    </div>
  );
}
