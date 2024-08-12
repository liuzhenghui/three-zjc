import {useEffect, useRef, useCallback, useState} from "react";

import useRenderer from '../../hooks/three/UseRenderer'
import useOrbitControls from '../../hooks/three/UseOrbitControls'
import useFloors from "../../hooks/UseFloors"

function ThreeRenderer(props) {

    const canvasRef = useRef()
    const [canvas, setCanvas] = useState()

    const callbackRef = useCallback((ref) => {
        if (!ref) return;
        canvasRef.current = ref;
        setCanvas(ref)
    }, [])

    // canvas 大小
    const dom = document.getElementsByClassName('three-renderer')
    const width = dom.length ? dom[0].clientWidth : 100;
    const height = dom.length ? dom[0].clientHeight : 100;

    console.log('ThreeRenderer width,height', width, height)
    const {renderer, scene, camera} = useRenderer({canvas, width, height})
    useOrbitControls({renderer, scene, camera})

    const floorActive = useFloors({renderer, scene, camera})

    useEffect(() => {
        if (typeof props.onLoad === 'function') {
            props.onLoad(scene)
        }

        if (scene) {
            // 加载模型
            const dracoLoader = new ThreeAddons.DRACOLoader()
            dracoLoader.setDecoderPath('resources/draco/')
            const gltfLoader = new ThreeAddons.GLTFLoader()
            gltfLoader.setDRACOLoader(dracoLoader);

            ['四周环境.glb'].forEach(file => {
                gltfLoader.load(`resources/models/${file}`, gltf => {
                    scene.add(gltf.scene)
                })
            })
        }

    }, [scene])

    return (
        <>
            <div className="three-renderer" style={{overflow: 'hidden'}}>
                <canvas ref={callbackRef}></canvas>
            </div>
        </>
    )
}

export default ThreeRenderer