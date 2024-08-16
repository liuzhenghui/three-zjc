import {useMemo} from "react";

function Animation() {
    const {Fiber, TWEEN} = window.ThreeLibs

    const {camera} = Fiber.useThree()

    const tween = useMemo(() => {
        return new TWEEN.Tween({x: camera.position.x, y: camera.position.y, z: camera.position.z})
            .to({x: 116, y: -10, z: 455}, 2000)
            .onUpdate(obj => camera.position.set(obj.x, obj.y, obj.z))
            .start()
    }, [])

    Fiber.useFrame(() => {
        tween.update()
    })

    return null
}

export default Animation