import {Suspense, forwardRef} from "react";

const GltfImpl = forwardRef((props, ref) => {
    const {Addons, Fiber} = window.ThreeLibs
    const {file, onLoad, onProgress, ...others} = props

    const {scene} = Fiber.useLoader(Addons.GLTFLoader, ('${appRes}/' + file), loader => {
        if (typeof onLoad === 'function') loader.manager.onLoad = () => {
            console.log('onLoad', file)
            onLoad()
        }
        if (typeof onProgress === 'function') loader.manager.onProgress = onProgress // (url, loaded, total) => void
    })

    return <primitive ref={ref} {...others} object={scene}/>
})

const Gltf = forwardRef((props, ref) => {
    return <Suspense fallback={null}><GltfImpl ref={ref} {...props}/></Suspense>
})

export default Gltf