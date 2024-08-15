function InitConfig({color}) {
    const {THREE, Fiber} = window.ThreeLibs
    const {gl, scene, camera} = Fiber.useThree();

    React.useEffect(() => {
        scene.fog = new THREE.Fog('#C1DBFE', 0.015, 3000)
        gl.setClearColor(0x4682B4, 0.6);
    }, [scene, color]);

    return null;
}

export default InitConfig