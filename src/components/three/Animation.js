import {useMemo} from "react";

function Animation(props) {
    const {Fiber, TWEEN} = window.ThreeLibs
    const {to = [0, 0, 0], time = 2000} = props

    const {camera} = Fiber.useThree()

    const tween = useMemo(() => {
        return new TWEEN.Tween({x: camera.position.x, y: camera.position.y, z: camera.position.z})
            .to({x: to?.[0] ?? 0, y: to?.[1] ?? 0, z: to?.[2] ?? 0}, time)
            .onUpdate(obj => camera.position.set(obj.x, obj.y, obj.z))
            .start()
    }, [])

    Fiber.useFrame(() => {
        tween.update()
    })

    return null
}

export default Animation