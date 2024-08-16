import {useEffect} from 'react';

function Sidebar(props) {
    const {floors, floor, onChange} = props

    useEffect(() => {

    }, []);

    return (
        <div className="Sidebar">
            <div
                className={`main item ${floor ? '' : 'active'}`}
                onClick={() => onChange?.(null)}
            >
                {floor ? '返回' : ''}首页
            </div>
            <div className="items">
                {floors.map(it => (
                    <div
                        key={it?.index}
                        className={`item ${floor?.index === it.index ? 'active' : ''}`}
                        onClick={() => onChange?.(it)}
                    >
                        {it.index + 1} 层
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Sidebar