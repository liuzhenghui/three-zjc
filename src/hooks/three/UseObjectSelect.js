import {useEffect, useState, useRef} from "react";
import useObjectHighlight from "./UseObjectHighlight";

function UseObjectSelect(props) {
    const {renderer, scene, camera, objects = []} = props

    const [selected, setSelected] = useState()
    const [highlight, setHighlight] = useObjectHighlight({name: 'UseObjectSelect', color: 0x00f000})

    const callbacks = useRef([]).current

    useEffect(() => {
        if (camera && renderer) {
            const width = renderer.domElement.clientWidth
            const height = renderer.domElement.clientHeight

            const raycaster = new THREE.Raycaster()
            let px, py
            const handleMouseup = event => {
                if (px === event.offsetX && py === event.offsetY) {
                    const x = (px / width) * 2 - 1;
                    const y = -(py / height) * 2 + 1;

                    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
                    const intersects = raycaster.intersectObjects(objects);
                    let obj = undefined
                    if (intersects.length) {
                        obj = intersects[0].object
                        console.log('selected', obj.name, obj)
                        while (obj && obj.type === 'Mesh') {
                            obj = obj.parent
                        }
                    }

                    if (obj !== selected) {
                        setSelected(obj)
                        setHighlight(obj)
                        callbacks.forEach(callback => callback(obj))
                    }
                }
            }
            renderer.domElement.addEventListener('mouseup', handleMouseup)
            const handleMousedown = event => {
                px = event.offsetX;
                py = event.offsetY;
            }
            renderer.domElement.addEventListener('mousedown', handleMousedown)

            return () => {
                renderer && renderer.domElement.removeEventListener('mouseup', handleMouseup)
                renderer && renderer.domElement.removeEventListener('mousedown', handleMousedown)
            }
        }

    }, [renderer, scene, camera, objects])

    const onChange = (callback) => {
        if (callback && typeof callback === 'function') {
            callbacks.push(callback)
        }
    }

    return selected
}

export default UseObjectSelect