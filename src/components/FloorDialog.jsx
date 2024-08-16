import React, {useEffect, useRef, useState, Suspense, useCallback} from 'react';
import {Button} from 'antd';
import CameraControls from "./three/CameraControls";

function FloorDialog(props) {
    const {Fiber} = window.ThreeLibs

    const {open = false, floor, onClose} = props

    useEffect(() => {
        return () => {
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
            floor?.traverse?.(child => {
                if (child.isMesh) {
                    // 清理几何体和材质
                    child.geometry.dispose();
                    if (child.material.isMaterial) {
                        cleanMaterial(child.material);
                    } else {
                        // 材质是数组的情况
                        for (let i = 0; i < child.material.length; i++) {
                            cleanMaterial(child.material[i]);
                        }
                    }
                }
            })
            floor?.dispose?.()
        }
    }, [floor])

    if (!open) return <></>

    return (
        <div className={`FloorDialog fadeIn ${open ? 'open' : ''}`}>
            <Fiber.Canvas
                camera={{position: [22, 50, 33]}}
            >
                <directionalLight intensity={2} position={[2000, 2000, 1000]}/>
                <pointLight position={[-100, -100, -100]}/>
                {floor ? <primitive object={floor}/> : null}
                <CameraControls
                    // onChange={camera => console.log('FloorDialog OrbitControls', camera?.position)}
                />
            </Fiber.Canvas>

            <div style={{position: 'absolute', top: 20, right: 20}}>
                <Button onClick={onClose}>返回</Button>
            </div>
        </div>
    )
}

export default FloorDialog