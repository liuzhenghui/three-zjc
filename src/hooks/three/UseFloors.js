import {useEffect, useState} from "react";
import useObjectSelect from "./UseObjectSelect";
import useObjectHover from "./UseObjectHover";
import useObjectHighlight from "./UseObjectHighlight";

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

    const floorActive = useObjectSelect({renderer, scene, camera, objects: floors})
    useObjectHighlight({renderer, scene, camera, object: floorActive})

    // const objectHover = useObjectHover({renderer, scene, camera, objects: floors})
    // useObjectHighlight({renderer, scene, camera, object: objectHover})

    useEffect(() => {
        if (camera && renderer) {
            // 加载模型
            const dracoLoader = new ThreeAddons.DRACOLoader()
            dracoLoader.setDecoderPath('resources/draco/')
            const gltfLoader = new ThreeAddons.GLTFLoader()
            gltfLoader.setDRACOLoader(dracoLoader);

            const floors = []
            for (let i = 0; i <= 69; i++) {
                gltfLoader.load(`resources/models/zjc/${i}.glb`, gltf => {
                    console.log('UseFloors gltf.scene', gltf.scene.children)
                    gltf.scene?.children?.forEach(child => {
                        child.userData = {
                            ...child.userData,
                            floorOriginal: {
                                material: child.material,
                                y: child.position.y,
                            }
                        }
                        if (child.isObject3D) {
                            child.receiveShadow = true
                            floors.push(child)
                        }
                    })
                    scene.add(gltf.scene)
                })
            }
            setFloors(floors)
        }

    }, [renderer, scene, camera])

    useEffect(() => {
        const index = floors.findIndex(it => it === floorActive)
        console.log('UseFloors index', index, floors.map(it => it.name))

        // // 选中的上面楼层往上偏移
        // console.log('UseFloors 上面', floors.slice(index))
        // floors.slice(index).forEach(obj => {
        //     obj.position.y = obj.userData.floorOriginal.y + 10
        //     updateMaterial(obj, 0xfff000)
        // })
        //
        // // 选中的下面楼层复原
        // console.log('UseFloors 下面', floors.slice(0, index))
        // floors.slice(0, index + 1).forEach(obj => {
        //     obj.position.y = obj.userData.floorOriginal.y
        //     updateMaterial(obj, 0xfff000)
        // })
        //
        // // 选中楼层高亮
        // if (floorActive) {
        //     floorActive.material = floorActive.userData?.floorOriginal?.material
        //     floorActive.traverse?.(child => {
        //         child.material = child.userData?.floorOriginal?.material
        //     })
        // }

    }, [floorActive])

    return floorActive
}

export default UseFloors