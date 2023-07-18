import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import {
  Environment,
  MeshPortalMaterial,
  OrbitControls,
  RoundedBox,
  useTexture,
  Text,
  CameraControls,
  useCursor,
} from "@react-three/drei";
import { Frog } from "./Frog";
import { MK } from "./MK";
import { Demon } from "./Demon";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";

export const Experience = () => {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null);
  useCursor(hovered);
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    if (active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt(
        0,
        0,
        5,
        targetPosition.x,
        targetPosition.y,
        targetPosition.z,
        true
      );
    } else {
      controlsRef.current.setLookAt(0, 0, 10, 0, 0, 0, true);
    }
  }, [active]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />
      <CameraControls ref={controlsRef} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 6} />
      <MonsterStage
        name={"FA"}
        color={"red"}
        texture={"textures/anime_open_cave_with_waterfalls_surronding_a_tree_.jpg"}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Frog scale={0.6} position-y={-1} hovered={hovered === "FA"} />
      </MonsterStage>
      <MonsterStage
        texture={"textures/oil_painting_undersea_abstract_shapes.jpg"}
        position-x={-2.5}
        rotation-y={Math.PI / 8}
        name={"LO"}
        color={"green"}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <MK scale={0.6} position-y={-1} hovered={hovered === "LO"} />
      </MonsterStage>
      <MonsterStage
        texture={"textures/scenic_outter_space_with_abstract_glowing_green_sh.jpg"}
        position-x={2.5}
        rotation-y={-Math.PI / 8}
        name={"PA"}
        color={"blue"}
        active={active}
        setActive={setActive}
        hovered={hovered}
        setHovered={setHovered}
      >
        <Demon scale={0.6} position-y={-1} hovered={hovered === "PA"} />
      </MonsterStage>
    </>
  );
};

const MonsterStage = ({
  children,
  texture,
  name,
  color,
  active,
  setActive,
  hovered,
  setHovered,
  ...props
}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();

  useFrame((_state, delta) => {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2, delta);
  });

  return (
    <group {...props}>
      <Text fontSize={0.3} position={[0, -1.3, 0.051]} anchorY={"bottom"}>
        {name}
        <meshBasicMaterial color={color} toneMapped={false} />
      </Text>
      <RoundedBox
        name={name}
        args={[2, 3, 0.1]}
        onDoubleClick={() => setActive(active === name ? null : name)}
        onPointerEnter={() => setHovered(name)}
        onPointerLeave={() => setHovered(null)}
      >
        <MeshPortalMaterial side={THREE.DoubleSide} ref={portalMaterial}>
          <ambientLight intensity={0.5} />
          <Environment preset="sunset" />
          {children}
          <mesh>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide} />
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
    </group>
  );
};
