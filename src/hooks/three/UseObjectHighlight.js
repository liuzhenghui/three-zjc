import {useEffect, useState, useCallback, useRef} from "react"

function UseObjectHighlight({name, color = 0xfff000}) {

    const id = useRef(Math.random().toString(16).slice(2)).current

    const [object, _setObject] = useState()
    const [objectsHighlight, setObjectsHighlight] = useState([])
    const [last, setLast] = useState([])
    let objectsHighlightLastRef = useRef([])

    useEffect(() => {
        // 还原上一次高亮物体
        console.log(name, 'objectsHighlightLast', id, objectsHighlightLastRef.current?.[0]?.name, objectsHighlightLastRef.current?.[1]?.name)
        objectsHighlightLastRef.current.forEach(obj => {
            obj.userData && console.log('obj.userData.materials', obj.userData.materials)
            if (obj.userData && obj.userData.materials && obj.userData[`material-${id}`]) {
                const material = obj.userData[`material-${id}`]
                obj.userData.materials = obj.userData.materials.filter(it => it !== material)
                console.log('obj.userData.materials', obj.userData.materials)
                obj.material = obj.userData.materialOriginal?.clone?.()
                console.log(name, 'objectsHighlightLast 还原', obj.name)
                // obj.userData.materials.forEach(it => obj.material = {...obj.material, ...it})
                obj.userData.materials.forEach(it => obj.material = Object.assign(obj.material, it))
            }
        })
        // three 物体材质改为高亮
        objectsHighlight.forEach(obj => {
            if (obj.material) {
                const material = {
                    color: new THREE.Color(color),
                    opacity: 0.6,
                    transparent: true,
                    depthWrite: false
                }
                obj.userData = {...obj.userData}
                // if (!obj.userData.materialOriginal) obj.userData.materialOriginal = obj.material
                // obj.userData.materialOriginal = obj.userData.materialOriginal ?? obj.material
                obj.userData.materials = obj.userData.materials ?? []
                obj.userData.materials = [...obj.userData.materials, material]
                obj.userData[`material-${id}`] = material
                obj.material = obj.userData.materialOriginal?.clone?.()
                obj.userData.materials.forEach(it => obj.material = Object.assign(obj.material, it))
                console.log(name, 'objectsHighlightLast 设置高亮', obj.name)
            }
        })
        objectsHighlightLastRef.current = objectsHighlight
        console.log(name, 'objectsHighlightLast2', objectsHighlightLastRef.current?.[0]?.name, objectsHighlightLastRef.current?.[1]?.name)

    }, [objectsHighlight])

    const setObject = useCallback((obj) => {
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
        }
        _setObject(obj)
        setObjectsHighlight(objects)
    }, [])

    return [object, setObject]
}

export default UseObjectHighlight