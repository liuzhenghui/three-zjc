import {Suspense, useState, useCallback} from "react";
import Glb from "./Glb";
import FloorDialog from "./FloorDialog";

function Home(props) {
    const {Three, Addons, Fiber, Drei} = window.ThreeLibs

    const [floor, setFloor] = useState(-100)

    const floors = new Array(70).fill(0).map((x, i) => i)

    const floorClickHandle = (() => {
        let timer = null
        return floor => {
            timer && clearTimeout(timer)
            timer = setTimeout(() => {
                setFloor(floor)
                // alert(floor)
            }, 100)
        }
    })()

    return (
        <div className="home">
            <Fiber.Canvas>
                <directionalLight args={[0xffffff, 3]} position={[1500, 800, 1870]}/>
                <pointLight position={[10, 10, 10]}/>
                <Suspense fallback={null}><Glb name="四周环境"/></Suspense>
                {floors.filter(it => it > 0).map(i => (
                    <Suspense key={i} fallback={null}><Glb name={i} onClick={() => floorClickHandle(0)}/></Suspense>
                ))}
                <Drei.OrbitControls/>
            </Fiber.Canvas>

            <FloorDialog floor={floor} open={floor >= 0} onClose={() => setFloor(-100)}/>
        </div>
    )
}

export default Home