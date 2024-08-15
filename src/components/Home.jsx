import {useRef, Suspense, useState, useMemo} from "react";
import Glb from "./Glb";
import FloorDialog from "./FloorDialog";
import Animation from "./three/Animation";
import InitConfig from "./three/InitConfig";
import CameraControls from "./three/CameraControls";

function Home(props) {
    const {Fiber, Drei} = window.ThreeLibs

    const [floor, setFloor] = useState(-100)

    const floors = new Array(70).fill(0).map((x, i) => i)


    const floorClickHandle = useMemo(() => {
        return (() => {
            let timer = null
            return floor => {
                timer && clearTimeout(timer)
                timer = setTimeout(() => {
                    console.log('floor', floor)
                    setTimeout(() => setFloor(floor), 1000)
                    // alert(floor)
                }, 100)
            }
        })()
    }, [])

    return (
        <div className="home">
            <Fiber.Canvas
                shadows
                camera={{fov: 75, near: 5, far: 2000, position: [-500, 750, 280]}}
            >
                <InitConfig/>
                <directionalLight args={[0xffffff, 1]} position={[2000, 2000, 1000]}/>
                <pointLight position={[-2000, -2000, -1000]}/>
                <ambientLight intensity={1} args={["#dedede"]}/>
                <Suspense fallback={null}><Glb name="四周环境"/></Suspense>
                {floors.map(i => (
                    <Suspense key={i} fallback={null}>
                        <Glb
                            name={i}
                            scale={(floor === i) ? 1 : 1.5}
                            onClick={() => floorClickHandle(i)}
                        />
                    </Suspense>
                ))}
                <CameraControls onChange={camera => {
                    // console.log('OrbitControls change', camera?.position)
                }}/>
                <Animation/>
            </Fiber.Canvas>

            <FloorDialog floor={floor} open={floor >= 0} onClose={() => setFloor(-100)}/>
        </div>
    )
}

export default Home