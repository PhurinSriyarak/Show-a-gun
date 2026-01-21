import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
    OrbitControls,
    Stage,
    Bounds,
    Environment,
    PerspectiveCamera,
    useHelper
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Mock function to determine where to place the part relative to the base receiver
const getPartPosition = (category) => {
    switch (category) {
        case 'barrel': return [2.5, 0, 0];
        case 'handguard': return [1.5, 0, 0];
        case 'stock': return [-1.7, 0, 0];
        case 'grip': return [0.3, -0.7, 0];
        case 'optic': return [0.3, 0.6, 0];
        default: return [0, 0, 0];
    }
};

const PartModel = ({ path, category, position = [0, 0, 0], scale = 1 }) => {
    let color = "#444";
    let size = [1, 1, 1];

    if (path.includes('barrel')) { color = "#222"; size = [3, 0.3, 0.3]; }
    if (path.includes('handguard')) { color = "#333"; size = [2.2, 0.5, 0.5]; }
    if (path.includes('stock')) { color = "#2d3436"; size = [1.2, 1, 0.4]; }
    if (path.includes('grip')) { color = "#222"; size = [0.4, 0.8, 0.4]; }
    if (path.includes('optic')) { color = "#111"; size = [0.6, 0.5, 0.4]; }

    return (
        <mesh position={getPartPosition(category)} scale={scale}>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} roughness={0.4} metalness={0.7} />
        </mesh>
    );
};

const CameraController = ({ cameraPreset }) => {
    const { camera, controls } = useThree();

    useEffect(() => {
        if (!controls) return;

        let targetPos = [5, 2, 5];
        let targetLookAt = [0, 0, 0];

        switch (cameraPreset) {
            case 'overview':
                targetPos = [5, 2, 5];
                break;
            case 'front':
                targetPos = [3, 1, 2];
                targetLookAt = [2, 0, 0];
                break;
            case 'rear':
                targetPos = [-3, 1, 2];
                targetLookAt = [-1.5, 0, 0];
                break;
            case 'side':
                targetPos = [0, 0.5, 6];
                break;
            default:
                break;
        }

        gsap.to(camera.position, {
            x: targetPos[0],
            y: targetPos[1],
            z: targetPos[2],
            duration: 1.2,
            ease: "power3.inOut"
        });

        gsap.to(controls.target, {
            x: targetLookAt[0],
            y: targetLookAt[1],
            z: targetLookAt[2],
            duration: 1.2,
            ease: "power3.inOut",
            onUpdate: () => controls.update()
        });
    }, [cameraPreset, camera, controls]);

    return null;
};

const Viewer = ({ selectedParts, baseColor, cameraPreset }) => {
    return (
        <div style={{ width: '100%', height: '100%', background: '#6e6e6eff' }}>
            <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
                <Suspense fallback={null}>
                    <CameraController cameraPreset={cameraPreset} />

                    <Stage
                        environment="city"
                        intensity={0.8}
                        contactShadow={{ opacity: 0.5, blur: 3 }}
                        adjustCamera={false}
                    >
                        <group>
                            {/* Base Gun Body */}
                            <mesh position={[0, 0, 0]}>
                                <boxGeometry args={[2.5, 0.9, 0.45]} />
                                <meshStandardMaterial color={baseColor} roughness={0.5} metalness={0.6} />
                            </mesh>

                            {/* Selected Parts */}
                            {Object.entries(selectedParts).map(([category, part]) => (
                                <PartModel
                                    key={category}
                                    category={category}
                                    path={part.model}
                                />
                            ))}
                        </group>
                    </Stage>

                    <OrbitControls
                        makeDefault
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 1.75}
                        enableDamping
                    />

                    <Environment preset="night" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Viewer;
