import {useEffect, useState} from "react";
import loadjs from 'loadjs'
import ThreeTest from "./three-test";


function Home(props) {

    const [loading, setLoading] = useState(true)
    const [t, setT] = useState(0)

    useEffect(() => {
        loadjs('resources/ThreeLibs.min.js', () => {
            console.log('window.ThreeLibs', window.ThreeLibs)
            setLoading(false)
        })
    }, []);

    return (
        <div className="home">
            {loading ? (<div>loading</div>) : (<ThreeTest/>)}
        </div>
    )
}

export default Home