import {useState, useMemo} from "react";
import Gltf from "./Gltf";
import FloorDialog from "./FloorDialog";
import Animation from "./three/Animation";
import InitConfig from "./three/InitConfig";
import CameraControls from "./three/CameraControls";
import Sidebar from "./Sidebar";

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

            <Sidebar floors={floors} floor={floor} onChange={f => !loading && setFloor(f)}/>

            <Fiber.Canvas
                className="main-canvas"
                shadows
                camera={{fov: 75, near: 5, far: 1200, position: [230, 550, -80]}}
            >
                <InitConfig/>
                <directionalLight intensity={1} position={[2000, 2000, 1000]}/>
                <pointLight position={[-2000, -2000, -1000]}/>
                <ambientLight intensity={1} args={["#dedede"]}/>
                {/*<fog attach="fog" args={[0xfff0ea, 1, 1500]}/>*/}
                <Drei.Sky
                    distance={100000}  // 天空盒的覆盖范围
                    sunPosition={[-800, 1000, -800]}  // 太阳位置
                    azimuth={180} //太阳水平方向位置
                    inclination={1000}  // 太阳倾斜角度，值越大太阳越高
                    mieCoefficient={0}  // Mie 散射系数，影响天空的亮度和颜色
                    mieDirectionalG={0.7}  // Mie 方向系数，影响天空的光散射角度
                    rayleigh={0.2}  // Rayleigh 散射系数，影响天空的亮度和颜色
                    turbidity={1}  // 浊度，影响天空的清晰度和颜色
                />
                {/*<mesh>*/}
                {/*    <planeGeometry args={[1, 1, 1]}/>*/}
                {/*    <meshPhysicalMateria color={0x808080} metalness={0} roughness={0.1}/>*/}
                {/*</mesh>*/}
                <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -150, 0]}>
                    <planeGeometry args={[10000, 10000]}/>
                    <meshPhysicalMaterial color={0x5A7EA0} receiveShadow={true} metalness={0} roughness={0.1}/>
                </mesh>
                <Gltf
                    file="四周环境new.glb"
                    ref={r => r?.position?.set?.(0, -150, 250)}
                    onProgress={(url, loaded, total) => setProgress(loaded / total)}
                    onLoad={() => setLoading(false)}
                />
                {floors.map(it => (
                    <Gltf
                        key={it.index}
                        file={it.file}
                        ref={r => {
                            r?.position?.set?.(0, -150, 250)
                            it.object = r
                        }}
                        onClick={() => floorClickHandle(it)}
                    />
                ))}
                <CameraControls
                    onChange={camera => console.log('OrbitControls change', camera?.position)}
                />
                {!loading ? <Animation/> : null}
            </Fiber.Canvas>

            <FloorDialog floor={floor} open={(!!floor)}/>

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