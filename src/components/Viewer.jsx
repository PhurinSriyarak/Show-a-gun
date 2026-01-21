import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
    OrbitControls,
    Stage,
    Environment,
    useGLTF,
    Clone
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Mock function to determine where to place the part relative to the base receiver
const getPartPosition = (category) => {
    switch (category) {
        case 'barrel': return [1.2, 0.3, 0];
        case 'handguard': return [0.8, 0.3, 0];
        case 'stock': return [-1.0, 0.1, 0];
        case 'grip': return [-0.2, -0.2, 0];
        case 'optic': return [0.1, 0.7, 0];
        default: return [0, 0, 0];
    }
};

const PartModel = ({ path, category }) => {
    // Use try-catch or conditional to handle missing models
    try {
        const { scene } = useGLTF(path);
        return <primitive object={scene.clone()} position={getPartPosition(category)} />;
    } catch (e) {
        // Fallback to a small marker if model fails to load
        return (
            <mesh position={getPartPosition(category)}>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshStandardMaterial color="red" />
            </mesh>
        );
    }
};

// Base gun model loader
const BaseGun = ({ color }) => {
    try {
        const { scene } = useGLTF('/models/base/ar15_base.glb');

        // Apply color to the base body if it has materials
        useEffect(() => {
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.material.color = new THREE.Color(color);
                }
            });
        }, [color, scene]);

        return <primitive object={scene} />;
    } catch (e) {
        // If no base model yet, show a placeholder
        return (
            <mesh>
                <boxGeometry args={[1.5, 0.5, 0.2]} />
                <meshStandardMaterial color={color} />
            </mesh>
        );
    }
};

const CameraController = ({ cameraPreset }) => {
    const { camera, controls } = useThree();

    useEffect(() => {
        if (!controls) return;

        let targetPos = [4, 1.5, 4];
        let targetLookAt = [0, 0, 0];

        switch (cameraPreset) {
            case 'overview':
                targetPos = [4, 1.5, 4];
                break;
            case 'front':
                targetPos = [2.5, 0.5, 1.5];
                targetLookAt = [1, 0.3, 0];
                break;
            case 'rear':
                targetPos = [-2.5, 0.5, 1.5];
                targetLookAt = [-0.8, 0.1, 0];
                break;
            case 'side':
                targetPos = [0, 0, 5];
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
        <div style={{ width: '100%', height: '100%', background: '#ffffff' }}>
            <Canvas shadows gl={{ preserveDrawingBuffer: true }} camera={{ position: [5, 2, 5] }}>
                <Suspense fallback={null}>
                    <CameraController cameraPreset={cameraPreset} />

                    <Stage
                        environment="city"
                        intensity={0.8}
                        contactShadow={{ opacity: 0.5, blur: 3 }}
                        adjustCamera={false}
                    >
                        <group>
                            <BaseGun color={baseColor} />

                            {/* Selected Parts */}
                            {Object.entries(selectedParts).map(([category, part]) => (
                                <PartModel
                                    key={category + part.id} // Change key to force re-render when part changes
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
