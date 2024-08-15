import {useEffect} from "react";

// import {Tween} from '@tweenjs/tween.js';

function Animation() {
    const {Fiber, TWEEN} = window.ThreeLibs

    const {camera} = Fiber.useThree()


    useEffect(() => {
        let requestId

        const tween = new TWEEN.Tween({x: camera.position.x, y: camera.position.y, z: camera.position.z})
            .to({x: 12, y: 97, z: 48}, 3000)
            .onUpdate(obj => {
                camera.position.set(obj.x, obj.y, obj.z);
            })
            .start()

        const frame = (time) => {
            tween.update(time)
            requestId = requestAnimationFrame(frame)
        }
        frame()

        return () => requestId && cancelAnimationFrame(requestId)
    }, [])

    return null;
}

export default Animation