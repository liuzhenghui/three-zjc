import {useEffect, useMemo} from "react";

function Animation() {
    const {Fiber, TWEEN} = window.ThreeLibs

    const {camera} = Fiber.useThree()

    const tween = useMemo(() => {
        return new TWEEN.Tween({x: camera.position.x, y: camera.position.y, z: camera.position.z})
            .to({x: 190, y: 475, z: 630}, 2000)
            .onUpdate(obj => camera.position.set(obj.x, obj.y, obj.z))

    }, [])

    useEffect(() => {
        setTimeout(() => {
            tween.start()
        }, 3000)
    }, [])

    Fiber.useFrame(() => {
        tween.update()
    })

    return null
}

export default Animation