import {useEffect, useState} from "react";
import loadjs from "loadjs";
import Home from "./components/Home";

function App() {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadjs('${appRes}/ThreeLibs.min.js', () => {
            console.log('ThreeLibs loaded', window.ThreeLibs)
            setLoading(false)
        })
    }, []);

    return (
        <>
            {loading ? (<div className="loading"></div>) : (<Home/>)}
        </>
    )
}

export default App
