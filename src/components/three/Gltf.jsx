import {Suspense, forwardRef, useEffect, useMemo} from "react";

// 全局
let dracoLoader
let onLoads = []
let onProgresses = []

const GltfImpl = forwardRef((props, ref) => {
    const {Addons, Fiber, Drei} = window.ThreeLibs
    const {file, overall = true, onLoad, onProgress, onClick, childrenProps = {}, ...others} = props

    if (!dracoLoader) {
        dracoLoader = new Addons.DRACOLoader()
        dracoLoader.setDecoderPath('${appRes}/draco/')
    }
    if (onLoad && onLoads.indexOf(onLoad) === -1) onLoads.push(onLoad)
    if (onProgress && onProgresses.indexOf(onProgress) === -1) onProgresses.push(onProgress)

    const {scene} = Fiber.useLoader(Addons.GLTFLoader, ('${appRes}/' + file), loader => {
        loader.setDRACOLoader(dracoLoader)
        if (typeof onLoad === 'function') loader.manager.onLoad = () => onLoads?.forEach(it => it?.())
        if (typeof onProgress === 'function') loader.manager.onProgress = (rl, loaded, total) => {
            onProgresses.forEach(it => it?.(rl, loaded, total))
        }
    })

    useEffect(() => {
        if (!overall) {
            scene?.traverse?.(child => {
                let materialOriginal
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        materialOriginal = child.material.map(it => it?.clone?.())
                    } else {
                        materialOriginal = child.material?.clone?.()
                    }
                }
                child.userData = {
                    ...child.userData,
                    materialOriginal,
                }
            })
        }

        return () => {
            onLoads = onLoads.filter(it => it !== onLoad)
            onProgresses = onProgresses.filter(it => it !== onProgress)
        }
    }, [])

    console.log('scene', scene)

    if (overall) {
        return <primitive {...others} object={scene} ref={ref}/>
    } else {
        return (
            <primitive {...others} object={scene} ref={ref}>
                {scene?.children?.map?.((it, index) => (
                    <primitive {...childrenProps} object={it}>
                        <Drei.Html
                            className="three-label"
                            ref={r => it.__label = r}
                            position={[20, 30, 0]}
                        >
                            点击查看 {it.name} 楼层内部
                        </Drei.Html>
                    </primitive>
                ))}
            </primitive>
        )
    }
})

const Gltf = forwardRef((props, ref) => {
    return <Suspense fallback={null}><GltfImpl ref={ref} {...props}/></Suspense>
})

export default Gltf