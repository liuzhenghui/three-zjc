import React, {useEffect, useRef, useState, Suspense} from 'react';

function Test() {
    const {Addons, Fiber} = window.ThreeLibs

    const {scene} = Fiber.useLoader(Addons.GLTFLoader, 'resources/models/zjc/2.glb')

    return <primitive object={scene}/>
}

function SubThree(props) {
    const {THREE, Addons, Fiber, Drei} = window.ThreeLibs

    const {onClose} = props

    const boxRef = useRef();
    const [hovered, setHover] = useState(false)

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
        <div style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, .8)',
            transition: 'all 10.35s',
            animation: 'fadeIn 1s forwards',
        }}>
            <Fiber.Canvas>
                <directionalLight args={[0xffffff]} position={[100, 800, 1870]}/>
                <pointLight position={[-1000, -1000, 1000]}/>
                <Suspense fallback={null}>
                    <Test/>
                </Suspense>
                <Drei.OrbitControls/>
            </Fiber.Canvas>
        </div>
    )
}

export default SubThree