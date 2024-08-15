import React, {useEffect, useRef, useState, Suspense} from 'react';
import {Button} from 'antd';
import Glb from "./Glb";


function FloorDialog(props) {
    const {Fiber, Drei} = window.ThreeLibs

    const {open = false, floor, onClose} = props

    if (!open || floor < 0) return <></>

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
                <Suspense fallback={null}><Glb name={floor}/></Suspense>
                <Drei.OrbitControls/>
            </Fiber.Canvas>

            <div style={{position: 'absolute', top: 200, right: 20}}>
                <Button onClick={onClose}>返回</Button>
            </div>
        </div>
    )
}

export default FloorDialog