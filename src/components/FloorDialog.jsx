import React, {useEffect, useRef, useState, Suspense, useCallback} from 'react';
import {Button} from 'antd';
import CameraControls from "./three/CameraControls";

function FloorDialog(props) {
    const {Fiber} = window.ThreeLibs

    const {open = false, floor, onClose} = props

    if (!open) return <></>

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
            <Fiber.Canvas
                camera={{position: [22, 50, 33]}}
            >
                <directionalLight args={[0xffffff]} position={[2000, 2000, 1000]}/>
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