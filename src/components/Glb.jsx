function Glb(props) {
    const {Addons, Fiber} = window.ThreeLibs
    const {name, ...others} = props

    const {scene} = Fiber.useLoader(Addons.GLTFLoader, '${appRes}/' + name + '.glb')

    return <primitive {...others} object={scene}/>
}

export default Glb