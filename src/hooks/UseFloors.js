import {useEffect, useState} from "react";
import useObjectSelect from "./three/UseObjectSelect";
import useObjectHover from "./three/UseObjectHover";

function UseFloors(props) {
    const {renderer, scene, camera, objectsSelectable = []} = props

    const [floors, setFloors] = useState([])

    const floorActive = useObjectSelect({renderer, scene, camera, objects: floors})
    const objectHover = useObjectHover({renderer, scene, camera, objects: floors})

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
                    gltf.scene.traverse(child => {
                        child.userData = {
                            ...child.userData,
                            materialOriginal: child.material?.clone?.(),
                            floorOriginal: {
                                material: child.material?.clone?.(),
                                y: child.position.y,
                            }
                        }
                    })
                    gltf.scene?.children?.forEach(child => {
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