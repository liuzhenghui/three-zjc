import {useState} from "react";
import Gltf from "./three/Gltf";
import FloorDialog from "./FloorDialog";
import Animation from "./three/Animation";
import InitConfig from "./three/InitConfig";
import CameraControls from "./three/CameraControls";
import Sidebar from "./Sidebar";
import Building from "./Building";

function Home(props) {
    const {Fiber, Drei} = window.ThreeLibs

    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState(0)
    const [floors, setFloors] = useState([])
    const [floor, setFloor] = useState()

    return (
        <div className="Home">

            <Sidebar floors={floors} floor={floor} onChange={f => !loading && setFloor(f)}/>

            <Fiber.Canvas
                className="main-canvas"
                shadows
                camera={{fov: 75, near: 5, far: 12000, position: [230, 550, -80]}}
            >
                <InitConfig/>
                <directionalLight intensity={1} position={[2000, 2000, 1000]}/>
                <pointLight position={[-2000, -2000, -1000]}/>
                <ambientLight intensity={1} args={["#dedede"]}/>
                <fog attach="fog" args={[0xfff0ea, 1, 4000]}/>
                <mesh rotation={[-0.5 * Math.PI, 0, 0]} position={[0, -150, 0]}>
                    <circleGeometry args={[10000, 180]}/>
                    <meshPhysicalMaterial color={0x5b6875} receiveShadow={true} metalness={0} roughness={0.1}/>
                </mesh>
                <Gltf
                    file="ground.glb"
                    position={[0, -150, 250]}
                    onProgress={(url, loaded, total) => setProgress(loaded / total)}
                    onLoad={() => setLoading(false)}
                />
                <Building
                    position={[0, -150, 250]}
                    onLoad={floors => setFloors(floors)}
                    onSelect={floor => {
                        console.log('onSelect', floor)
                        setFloor(floor)
                    }}
                />
                <CameraControls maxPolarAngle={90 / 180 * Math.PI}/>
                {!loading ? <Animation to={[38, 4, 470]} time={2000}/> : null}
            </Fiber.Canvas>

            <FloorDialog floor={floor} open={(!!floor)} onClose={() => setFloor(null)}/>

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