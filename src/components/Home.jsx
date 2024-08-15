import {useEffect, Suspense, useState, useMemo} from "react";
import Glb from "./Glb";
import FloorDialog from "./FloorDialog";
import Animation from "./three/Animation";
import InitConfig from "./three/InitConfig";

function Home(props) {
    const {THREE, Fiber, Drei} = window.ThreeLibs


    const [floor, setFloor] = useState(-100)

    const floors = new Array(70).fill(0).map((x, i) => i)


    const floorClickHandle = useMemo(() => {
        return (() => {
            let timer = null
            return floor => {
                timer && clearTimeout(timer)
                timer = setTimeout(() => {
                    setFloor(floor)
                    // alert(floor)
                }, 100)
            }
        })()
    }, [])

    return (
        <div className="home">
            <Fiber.Canvas
                gl={{
                    clearColor: new THREE.Color(0x4682B4, 0.6),
                }}
                shadows="soft"
                camera={{fov: 75, near: 0.1, far: 1000, position: [112, 197, 248]}}
            >
                <InitConfig/>
                <Drei.PerspectiveCamera
                    fov={6}
                    aspect={window.innerWidth / window.innerHeight}
                    near={0.1}
                    far={10}
                    position={[0, 0, 0]}
                />
                <directionalLight args={[0xffffff, 1]} position={[1500, 800, 1870]}/>
                <pointLight position={[10, 10, 10]}/>
                <ambientLight intensity={1} args={["#dedede"]}/>
                <Suspense fallback={null}><Glb name="四周环境"/></Suspense>
                {floors.filter(it => it > 0).map(i => (
                    <Suspense key={i} fallback={null}>
                        <Glb
                            name={i}
                            scale={(floor === i) ? 1 : 1.5}
                            onClick={() => floorClickHandle(0)}
                        />
                    </Suspense>
                ))}
                <Drei.OrbitControls/>
                <Animation/>
            </Fiber.Canvas>

            {/*<FloorDialog floor={floor} open={floor >= 0} onClose={() => setFloor(-100)}/>*/}
        </div>
    )
}

export default Home