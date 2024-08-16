function CameraControls(props) {
    const {Fiber, Drei} = window.ThreeLibs

    const {onChange} = props

    const {camera} = Fiber.useThree()

    return <Drei.OrbitControls
        enableDamping={true}
        {...props}
        onChange={() => onChange?.(camera)}
    />
}

export default CameraControls