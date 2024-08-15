import React, {useEffect, useRef, useState, Suspense} from 'react';
import SubThree from "./sub-three";

function Test() {
    const {Addons, Fiber} = window.ThreeLibs

    const {scene} = Fiber.useLoader(Addons.GLTFLoader, 'resources/models/zjc/1.glb')

    return <primitive object={scene}/>
}

function ThreeTest(props) {
    const {Three, Addons, Fiber, Drei} = window.ThreeLibs

    const boxRef = useRef();
    const [hovered, setHover] = useState(false)
    const [visible, setVisible] = useState(false)

    useEffect(() => {

        let requestId
        const frame = () => {
            if (boxRef.current) boxRef.current.rotation.x += 0.01
            requestId = requestAnimationFrame(frame)
        }
        frame()

        return () => requestId && cancelAnimationFrame(requestId)
    })

    return (
        <div style={{width: '100%', height: '100%'}}>
            <Fiber.Canvas>
                <directionalLight args={[0xffffff, 3]} position={[1500, 800, 1870]}/>
                <pointLight position={[10, 10, 10]}/>
                <group>
                    <mesh
                        ref={boxRef}
                        onPointerOver={() => setHover(true)}
                        onPointerOut={() => setHover(false)}
                        onClick={() => setVisible(true)}
                    >
                        <boxGeometry args={[2, 2, 2]}/>
                        <meshStandardMaterial/>
                        <meshStandardMaterial color={hovered ? "hotpink" : "orange"}/>
                    </mesh>
                </group>
                <Suspense fallback={null}>
                    <Test/>
                </Suspense>
                <Drei.OrbitControls/>
            </Fiber.Canvas>
            {visible ? (<SubThree/>) : null}
        </div>
    )
}

export default ThreeTest