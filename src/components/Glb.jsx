import {useRef} from "react";

function Glb(props) {
    const {Addons, Fiber} = window.ThreeLibs
    const {name, children = false, ...others} = props

    const {scene} = Fiber.useLoader(Addons.GLTFLoader, ('${appRes}/' + name + '.glb'), loader => {
        loader.manager.onLoad = () => console.log(`${name} load`)
        loader.manager.onProgress = (url, loaded, total) => {
            console.log(`${url} progress: ${loaded}/${total}  => ${Math.round(loaded / total * 100)}`)
        }
    })

    return (
        <>
            {children ? (
                scene?.children?.map((it, i) => <primitive ref={r => {
                    r.position?.set?.(0, 0, 0)
                    console.log(name, 'position', r.position)
                }} key={i} {...others} object={it}/>)
            ) : (<primitive {...others} object={scene}/>)}
        </>
    )
}

export default Glb