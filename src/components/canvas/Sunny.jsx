import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload, Texture } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import styled from "styled-components";
import { TextureLoader } from "three";
import sunnyTexture from "../../images/sun.png";

// Styled wrapper for the Canvas
const StyledCanvasWrapper = styled.div`
  width: 100%;
  height: auto;
  position: absolute;
  inset: 0;
`;

// Snowflakes component
const Sunny = (props) => {
  const texture = new TextureLoader().load(sunnyTexture);
  const ref = useRef();
  const [snowflakePositions] = useState(() => {
    const positions = new Float32Array(5000 * 3);
    for (let i = 0; i < 5000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2; // x
      positions[i * 3 + 1] = Math.random() * 2 - 1; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2; // z
    }
    return positions;
  });

  // Animation for falling snowflakes
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;

    // Snowflake drift effect
    ref.current.position.y -= delta * 0.02;
    if (ref.current.position.y < -1.2) {
      ref.current.position.y = 1.2;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points
        ref={ref}
        positions={snowflakePositions}
        stride={3}
        frustumCulled
        {...props}
      >
        <PointMaterial
          transparent
          color="#ffffff" // Snowflake color
          size={0.006} // Size of the sun
          sizeAttenuation={true}
          depthWrite={false}
          map={texture}
        />
      </Points>
    </group>
  );
};

// Main component
const StyledSunnyCanvas = () => {
  return (
    <StyledCanvasWrapper>
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <Sunny />
        </Suspense>
        <Preload all />
      </Canvas>
    </StyledCanvasWrapper>
  );
};

export default StyledSunnyCanvas;
