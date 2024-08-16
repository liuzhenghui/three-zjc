import {Suspense, forwardRef, useRef} from "react";

const GltfImpl = forwardRef((props, ref) => {
    const {Addons, Fiber} = window.ThreeLibs
    const {file, onLoad, onProgress, onClick, onRef, ...others} = props
    const dracoLoader = useRef(new Addons.DRACOLoader()).current

    const {scene} = Fiber.useLoader(Addons.GLTFLoader, ('${appRes}/' + file), loader => {
        dracoLoader.setDecoderPath('${appRes}/draco/')
        loader.setDRACOLoader(dracoLoader)
        if (typeof onLoad === 'function') loader.manager.onLoad = onLoad
        if (typeof onProgress === 'function') loader.manager.onProgress = onProgress // (url, loaded, total) => void
    })

    return scene?.children?.map?.(it => (
        <primitive
            {...others}
            object={it}
            ref={ref => onRef?.(it.name, ref)}
            onClick={(...params) => onClick?.(it.name, ...params)}
        />
    ))
})

const Gltf = forwardRef((props, ref) => {
    return <Suspense fallback={null}><GltfImpl ref={ref} {...props}/></Suspense>
})

export default Gltf