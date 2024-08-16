import {useRef, Suspense, useState, useMemo} from "react";
import Gltf from "./Gltf";
import FloorDialog from "./FloorDialog";
import Animation from "./three/Animation";
import InitConfig from "./three/InitConfig";
import CameraControls from "./three/CameraControls";

function Home(props) {
    const {Fiber, Drei} = window.ThreeLibs

    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [floor, setFloor] = useState()

    const floors = new Array(70).fill({}).map((x, i) => ({index: i, file: `${i}.glb`}))

    // 防抖，点击模型会触多次，以及会穿透模型选中多个
    const floorClickHandle = useMemo(() => {
        return (() => {
            let timer = null
            return floor => {
                timer && clearTimeout(timer)
                timer = setTimeout(() => setFloor(floor), 100)
            }
        })()
    }, [])

    return (
        <div className="Home">
            <Fiber.Canvas
                className="main-canvas"
                shadows
                camera={{fov: 75, near: 5, far: 2000, position: [65, 160, 200]}}
            >
                <InitConfig/>
                <directionalLight intensity={1} position={[2000, 2000, 1000]}/>
                <pointLight position={[-2000, -2000, -1000]}/>
                <ambientLight intensity={1} args={["#dedede"]}/>
                <Gltf file="四周环境.glb"
                      onProgress={(url, loaded, total) => setProgress(loaded / total)}
                      onLoad={() => setLoading(false)}
                />
                {floors.map(it => (
                    <Gltf
                        key={it.index}
                        file={it.file}
                        ref={ref => it.object = ref}
                        onClick={() => floorClickHandle(it)}
                    />
                ))}
                <CameraControls
                    // onChange={camera => console.log('OrbitControls change', camera?.position)}
                />
                {!loading ? <Animation/> : null}
            </Fiber.Canvas>

            <FloorDialog floor={floor?.object?.children?.[0]?.clone?.()} open={(!!floor)}
                         onClose={() => setFloor(null)}/>

            {loading ? (
                <div className="loading">
                    <progress max={1} value={progress}></progress>
                    <div>正在加载模型({(progress * 100).toFixed(1)}%)</div>
                </div>
            ) : null}
        </div>
    )
}

export default Home