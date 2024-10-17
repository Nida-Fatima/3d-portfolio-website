import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload, useTexture } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import styled from "styled-components";
import { TextureLoader } from "three";
// Import a raindrop texture or use a placeholder
import raindropTexture from "../../images/rainDrop.png";

// Styled wrapper for the Canvas
const StyledCanvasWrapper = styled.div`
  width: 100%;
  height: auto;
  position: absolute;
  inset: 0;
`;

// FallingRain component
const FallingRain = (props) => {
  // Load the raindrop texture
  const texture = new TextureLoader().load(raindropTexture);
  const ref = useRef();

  // Generate random positions for the raindrops
  const [rainPositions] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2; // x
      positions[i * 3 + 1] = Math.random() * 2; // y (starting above the view)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2; // z
    }
    return positions;
  });

  // Animation for falling raindrops
  useFrame((state, delta) => {
    // Update raindrop positions
    const positions = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= delta * 0.05; // Fall effect slower for slow rain
      if (positions[i + 1] < -1.2) {
        positions[i + 1] = 1.2; // Reset to top
        positions[i] = (Math.random() - 0.5) * 2; // Random x
        positions[i + 2] = (Math.random() - 0.5) * 2; // Random z
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true; // Notify Three.js of the update
  });

  return (
    <group>
      <Points
        ref={ref}
        positions={rainPositions}
        stride={3}
        frustumCulled
        {...props}
      >
        <PointMaterial
          transparent
          color="#00aaff" // Raindrop color (adjust as needed)
          size={0.005} // Size of the raindrops
          sizeAttenuation={true}
          depthWrite={false}
          map={texture}
        />
      </Points>
    </group>
  );
};

// Main component
const StyledFallingRainCanvas = () => {
  return (
    <StyledCanvasWrapper>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <FallingRain />
        </Suspense>
        <Preload all />
      </Canvas>
    </StyledCanvasWrapper>
  );
};

export default StyledFallingRainCanvas;
