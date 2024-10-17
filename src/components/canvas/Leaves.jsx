import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload, useTexture } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import styled from "styled-components";
import { TextureLoader } from "three";
import leafTexture from "../../images/leaves.png";

// Styled wrapper for the Canvas
const StyledCanvasWrapper = styled.div`
  width: 100%;
  height: auto;
  position: absolute;
  inset: 0;
`;

// FallingLeaves component
const FallingLeaves = (props) => {
  // Load the leaf texture
  const texture = new TextureLoader().load(leafTexture);
  const ref = useRef();

  // Generate random positions for the leaves
  const [leafPositions] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2; // x
      positions[i * 3 + 1] = Math.random() * 2; // y (starting above the view)
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2; // z
    }
    return positions;
  });

  // Animation for falling leaves
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;

    // Update leaf positions
    const positions = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 1] -= delta * 0.01; // Fall effect
      if (positions[i + 1] < -1.2) {
        positions[i + 1] = 1.2; // Reset to top
        positions[i] = (Math.random() - 0.5) * 2; // Random x
        positions[i + 2] = (Math.random() - 0.5) * 2; // Random z
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true; // Notify Three.js of the update
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={leafPositions}
        stride={3}
        frustumCulled
        {...props}
      >
        <PointMaterial
          transparent
          color="#a8b300" // Leaf color (adjust as needed)
          size={0.005} // Size of the leaves
          sizeAttenuation={true}
          depthWrite={false}
          map={texture}
        />
      </Points>
    </group>
  );
};

// Main component
const StyledFallingLeavesCanvas = () => {
  return (
    <StyledCanvasWrapper>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <FallingLeaves />
        </Suspense>
        <Preload all />
      </Canvas>
    </StyledCanvasWrapper>
  );
};

export default StyledFallingLeavesCanvas;
