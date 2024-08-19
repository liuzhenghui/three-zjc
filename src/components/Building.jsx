import {useMemo, forwardRef, useState} from 'react';
import Gltf from "./three/Gltf";

function Building(props, ref) {
    const {THREE} = window.ThreeLibs
    const {onLoad, onSelect, ...others} = props

    const floors = useMemo(() => {
        return new Array(70).fill({})
            .map((x, i) => ({index: i, name: 'floor' + i.toString().padStart(3, '0')}))
    }, [])

    return (<Gltf
        file="building.glb"
        overall={false}
        {...others}
        onLoad={() => {
            console.log('building load')
            onLoad?.(floors)
        }}
        childrenProps={{
            _floor: true,
            style: {cursor: 'pointer'},
            ref: r => {
                console.log('childrenProps ref', r)
                const found = floors.find(it => it.name === r?.name)
                if (found) found.object = r
            },
            onClick: e => {
                e?.stopPropagation?.()
                console.log('onClick', e)
                let parent = e?.object
                while (parent && !parent?._floor) {
                    parent = parent?.parent
                }
                parent?.traverse?.(child => {
                    if (child?.material || child?.userData?.materialOriginal) {
                        child.material = child?.userData?.materialOriginal
                    }
                })
                onSelect?.(floors.find(it => it.name === parent?.name))
            },
            onPointerEnter: e => {
                e.stopPropagation()
                e.srcElement.style.cursor = 'pointer'
                let parent = e?.object
                while (parent && !parent?._floor) {
                    parent = parent.parent
                }
                if (parent.__label) {
                    if (parent.__label) {
                        parent.__label.style.display = 'block'
                    }
                }
                parent?.traverse?.(child => {
                    if (child?.material) {
                        if (Array.isArray(child.material)) {
                            child.material = child.material.map(it => (Object.assign(it.material.clone(), {
                                color: new THREE.Color(0xfff000), transparent: true, depthWrite: false, opacity: 1,
                            })))
                        } else {
                            child.material = Object.assign(child.material.clone(), {
                                color: new THREE.Color(0xfff000), transparent: true, depthWrite: false, opacity: 1,
                            })
                        }
                    }
                })
            }, onPointerOut: e => {
                e.srcElement.style.cursor = 'auto'
                let parent = e?.object
                while (parent && !parent?._floor) {
                    parent = parent.parent
                }
                if (parent.__label.style) {
                    parent.__label.style.display = 'none'
                }
                parent?.traverse?.(child => {
                    if (child?.material || child?.userData?.materialOriginal) {
                        child.material = child?.userData?.materialOriginal
                    }
                })
            },
        }}
    />)
}

export default forwardRef(Building)