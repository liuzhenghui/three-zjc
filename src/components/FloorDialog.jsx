import React, {useMemo} from 'react';
import CameraControls from "./three/CameraControls";
import Animation from "./three/Animation";

// 释放资源
const cleanMaterial = material => {
    material.dispose(); // 清理材质
    if (material.map) material.map.dispose(); // 清理纹理
    if (material.lightMap) material.lightMap.dispose();
    if (material.bumpMap) material.bumpMap.dispose();
    if (material.normalMap) material.normalMap.dispose();
    if (material.specularMap) material.specularMap.dispose();
    if (material.envMap) material.envMap.dispose();
}

function FloorDialog(props) {
    const {Fiber, Drei} = window.ThreeLibs

    const {open = false, floor} = props

    const object = useMemo(() => floor?.object?.children?.[0]?.clone?.(), [floor])

    if (!open) return <></>

    return (
        <div className={`FloorDialog ${open ? 'open' : ''}`}>
            <div className="header">
                <div className="title">第 {floor?.index + 1} 层</div>
            </div>
            <Fiber.Canvas key={floor?.index} camera={{position: [15, -15, -25]}}>
                <directionalLight intensity={2} position={[2000, 2000, 1000]}/>
                <pointLight position={[-100, -100, -100]}/>
                {object ? <primitive ref={r => r?.position?.set?.(0, -10, 0)} object={object}/> : null}
                <CameraControls
                    onChange={camera => console.log('FloorDialog OrbitControls', camera?.position)}
                />
                <Animation to={[5, 22, 22]} time={3000}/>
            </Fiber.Canvas>
        </div>
    )
}

export default FloorDialog