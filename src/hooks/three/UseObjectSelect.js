import {useEffect, useState} from "react";
import useObjectHighlight from "./UseObjectHighlight";

function UseObjectSelect(props) {
    const {renderer, scene, camera, objects = []} = props

    const [selected, setSelected] = useState()
    const [highlight, setHighlight] = useObjectHighlight({name: 'UseObjectSelect', color: 0x00f000})

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
                    if (intersects.length) {
                        let obj = intersects[0].object
                        console.log('selected', obj.name, obj)
                        while (obj && obj.type === 'Mesh') {
                            obj = obj.parent
                        }
                        setSelected(obj)
                        setHighlight(obj)
                    } else {
                        setSelected(undefined)
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

    return selected
}

export default UseObjectSelect