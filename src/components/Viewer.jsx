import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import {
    OrbitControls,
    Stage,
    Environment,
    useGLTF,
    TransformControls
} from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';

// Function to calculate base position
const getBasePartPosition = (category) => {
    switch (category) {
        case 'barrel': return [1.2, 0.3, 0];
        case 'handguard': return [0.8, 0.3, 0];
        case 'stock': return [-1.0, 0.1, 0];
        case 'grip': return [-0.2, -0.2, 0];
        case 'optic': return [0.1, 0.7, 0];
        default: return [0, 0, 0];
    }
};

const PartModel = ({ part, category, isSelected, editMode, onSelect, transformMode }) => {
    const meshRef = useRef();
    const { scene } = useGLTF(part.model);

    // Initial transforms from data
    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.position.set(
                getBasePartPosition(category)[0] + (part.offset?.[0] || 0),
                getBasePartPosition(category)[1] + (part.offset?.[1] || 0),
                getBasePartPosition(category)[2] + (part.offset?.[2] || 0)
            );
            if (part.scale) meshRef.current.scale.set(...part.scale);
            if (part.rotation) meshRef.current.rotation.set(...part.rotation);
        }
    }, [part, category]);

    const handleTransformChange = () => {
        if (meshRef.current) {
            const pos = meshRef.current.position;
            const rot = meshRef.current.rotation;
            const sca = meshRef.current.scale;
            const basePos = getBasePartPosition(category);

            // Log to console so user can copy these values
            console.log(`--- Values for ${category} ---`);
            console.log(`"offset": [${(pos.x - basePos[0]).toFixed(3)}, ${(pos.y - basePos[1]).toFixed(3)}, ${(pos.z - basePos[2]).toFixed(3)}]`);
            console.log(`"rotation": [${rot.x.toFixed(3)}, ${rot.y.toFixed(3)}, ${rot.z.toFixed(3)}]`);
            console.log(`"scale": [${sca.x.toFixed(5)}, ${sca.y.toFixed(5)}, ${sca.z.toFixed(5)}]`);
        }
    };

    return (
        <group>
            <primitive
                ref={meshRef}
                object={scene.clone()}
                onClick={(e) => {
                    if (editMode) {
                        e.stopPropagation();
                        onSelect();
                    }
                }}
            />
            {isSelected && editMode && (
                <TransformControls
                    object={meshRef.current}
                    mode={transformMode}
                    onChange={handleTransformChange}
                />
            )}
        </group>
    );
};

const BaseGun = ({ color }) => {
    try {
        const { scene } = useGLTF('/models/base/ar15_base.glb');
        useEffect(() => {
            scene.traverse((child) => {
                if (child.isMesh) {
                    child.material.color = new THREE.Color(color);
                }
            });
        }, [color, scene]);
        return <primitive object={scene} />;
    } catch (e) {
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
            case 'overview': targetPos = [4, 1.5, 4]; break;
            case 'front': targetPos = [2.5, 0.5, 1.5]; targetLookAt = [1, 0.3, 0]; break;
            case 'rear': targetPos = [-2.5, 0.5, 1.5]; targetLookAt = [-0.8, 0.1, 0]; break;
            case 'side': targetPos = [0, 0, 5]; break;
        }
        gsap.to(camera.position, { x: targetPos[0], y: targetPos[1], z: targetPos[2], duration: 1.2, ease: "power3.inOut" });
        gsap.to(controls.target, { x: targetLookAt[0], y: targetLookAt[1], z: targetLookAt[2], duration: 1.2, ease: "power3.inOut", onUpdate: () => controls.update() });
    }, [cameraPreset, camera, controls]);
    return null;
};

const Viewer = ({ selectedParts, baseColor, cameraPreset, editMode, activeCategory, onSelectCategory }) => {
    const [transformMode, setTransformMode] = useState('translate');

    // Keyboard shortcuts for transform modes
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'w') setTransformMode('translate');
            if (e.key === 'e') setTransformMode('rotate');
            if (e.key === 'r') setTransformMode('scale');
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="canvas-wrapper" style={{ width: '100%', height: '100%', background: '#ffffff' }}>
            <Canvas shadows gl={{ preserveDrawingBuffer: true }} camera={{ position: [5, 2, 5] }}>
                <Suspense fallback={null}>
                    <CameraController cameraPreset={cameraPreset} />
                    <Stage environment="city" intensity={0.8} contactShadow={{ opacity: 0.5, blur: 3 }} adjustCamera={false}>
                        <group>
                            <BaseGun color={baseColor} />
                            {Object.entries(selectedParts).map(([category, part]) => (
                                <PartModel
                                    key={category + part.id}
                                    part={part}
                                    category={category}
                                    editMode={editMode}
                                    isSelected={activeCategory === category}
                                    onSelect={() => onSelectCategory(category)}
                                    transformMode={transformMode}
                                />
                            ))}
                        </group>
                    </Stage>
                    <OrbitControls
                        makeDefault
                        minPolarAngle={0}
                        maxPolarAngle={Math.PI / 1.75}
                        enableDamping
                        enabled={true} // In a real production app, we would disable this when TransformControls is dragging
                    />
                    <Environment preset="night" />
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Viewer;
