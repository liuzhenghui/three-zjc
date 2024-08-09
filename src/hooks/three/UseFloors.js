import {useEffect, useState} from "react";
import useSelectObject from "./UseSelectObject";

const updateMaterial = (obj, color) => {
    const objects = []
    if (obj) {
        if (obj) {
            if (obj.type === 'Group') {
                obj.traverse?.(child => {
                    if (child.isObject3D) {
                        objects.push(child)
                    }
                })
            } else {
                objects.push(obj)
            }
        }
        objects.forEach(obj => {
            if (obj.material) {
                const materials = Array.isArray(obj.material) ? obj.material : [obj.material]
                materials.forEach(it => {
                    const material = it.clone()
                    material.color.setHex(color)
                    material.opacity = 0.4
                    material.transparent = true
                    material.depthWrite = false
                    obj.material = material
                })
            }
        })
    }
    return objects
}

function UseFloors(props) {
    const {renderer, scene, camera, objectsSelectable = []} = props

    const [floors, setFloors] = useState([])
    const [selected, setSelected] = useState()

    console.log('UseFloors floors', floors)
    const floorActive = useSelectObject({renderer, scene, camera, objectsSelectable: floors})

    useEffect(() => {
        if (camera && renderer) {
            // 加载模型
            const dracoLoader = new ThreeAddons.DRACOLoader()
            dracoLoader.setDecoderPath('resources/draco/')
            const gltfLoader = new ThreeAddons.GLTFLoader()
            gltfLoader.setDRACOLoader(dracoLoader);

            for (let i = 0; i <= 69; i++) {

                gltfLoader.load(`resources/models/zjc/${i}.glb`, gltf => {
                    gltf.scene.traverse(child => {
                        child.userData = {
                            ...child.userData,
                            floorOriginal: {
                                material: child.material,
                                y: child.position.y,
                            }
                        }
                        if (child.isObject3D) {
                            child.receiveShadow = true
                            console.log('UseFloors traverse', child.name, child)
                            scene.add(gltf.scene)
                        }
                    })
                })
            }
            /**
             gltfLoader.load(`resources/models/大楼分层.glb`, gltf => {

             const names = ['平面', '平面.001', '平面.002', '平面.003', '平面.004', '平面.005', '平面.006', '平面.007']
             let objects = []
             gltf.scene.traverse(child => {
             child.userData = {
             ...child.userData,
             floorOriginal: {
             material: child.material,
             y: child.position.y,
             }
             }
             if (child.isObject3D) {
             child.receiveShadow = true
             console.log('UseFloors traverse', child.name, child)
             // if (names.indexOf(child.name) >= 0) {
             //     objects.push(child);
             // }
             if (child.name && child.name.startsWith('floor')) {
             objects.push(child)
             }
             }
             })
             // objects = objects.sort((a, b) => names.indexOf(a.name) - names.indexOf(b.name))
             objects = objects.reverse()
             console.log('UseFloors objects', objects)
             scene.add(gltf.scene)
             setFloors(objects)
             })
             **/
        }

    }, [renderer, scene, camera])

    useEffect(() => {
        const index = floors.findIndex(it => it === floorActive)
        console.log('UseFloors index', index, floors.map(it => it.name))

        // 选中的上面楼层往上偏移
        console.log('UseFloors 上面', floors.slice(index))
        floors.slice(index).forEach(obj => {
            obj.position.y = obj.userData.floorOriginal.y + 10
            updateMaterial(obj, 0xfff000)
        })

        // 选中的下面楼层复原
        console.log('UseFloors 下面', floors.slice(0, index))
        floors.slice(0, index + 1).forEach(obj => {
            obj.position.y = obj.userData.floorOriginal.y
            updateMaterial(obj, 0xfff000)
        })

        // 选中楼层高亮
        if (floorActive) {
            floorActive.material = floorActive.userData?.floorOriginal?.material
            floorActive.traverse?.(child => {
                child.material = child.userData?.floorOriginal?.material
            })
        }

    }, [floorActive])

    return floorActive
}

export default UseFloors