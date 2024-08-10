import {useEffect, useState} from "react";
import useObjectHighlight from "./UseObjectHighlight";

function UseObjectHover(props) {
    const {renderer, scene, camera, objects = []} = props

    const [objectActivated, setObjectActivated] = useState()
    const [highlight, setHighlight] = useObjectHighlight({name: 'UseObjectHover', color: 0xfff000})

    useEffect(() => {
        if (camera && renderer) {
            const width = renderer.domElement.clientWidth
            const height = renderer.domElement.clientHeight

            const raycaster = new THREE.Raycaster()
            const handle = (() => {
                let timer = null
                return event => {
                    timer && clearTimeout(timer)
                    timer = setTimeout(() => {
                        const px = event.offsetX;
                        const py = event.offsetY;
                        const x = (px / width) * 2 - 1;
                        const y = -(py / height) * 2 + 1;

                        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
                        const intersects = raycaster.intersectObjects(objects);
                        console.log('UseObjectHover...', intersects, objects)
                        if (intersects.length) {
                            let obj = intersects[0].object
                            while (obj && obj.type === 'Mesh') {
                                obj = obj.parent
                            }
                            setObjectActivated(obj)
                            setHighlight(obj)
                        } else {
                            setObjectActivated(undefined)
                        }
                    }, 15)
                }
            })()
            renderer.domElement.addEventListener('mousemove', handle)

            return () => {
                renderer && renderer.domElement.removeEventListener('mousemove', handle)
            }
        }

    }, [renderer, scene, camera, objects])

    return objectActivated
}

export default UseObjectHover