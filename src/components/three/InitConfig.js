function InitConfig({color}) {
    const {THREE, Fiber} = window.ThreeLibs
    const {gl, scene, camera} = Fiber.useThree();

    React.useEffect(() => {
        gl.setClearColor(0x4682B4, 0.6);

        let loader = new THREE.CubeTextureLoader();
        let texture = loader.setPath('${appRes}/');
        texture.load(
            ['6.png', '3.png', '2.png', '1.png', '5.png', '4.png'],
            texture => scene.background = texture
        )

    }, [scene, color]);

    return null;
}

export default InitConfig