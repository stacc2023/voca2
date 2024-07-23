import { useContext, useState } from "react";
import { AppContext } from "../context";

function Sheet({ name, onClick, loading }) {
    return <li key={name}
        onClick={() => onClick(name)}
    >
        { loading == name ? 'data is loading...' : name }
    </li>
}

export default function Sheets({ sheets }) {
    const [loading, setLoading] = useState(null);
    const { setWords, setRawWords, setSheet } = useContext(AppContext);


    function onSheetClick(name) {
        if (loading != null) return
        setLoading(name);

        fetch(`/sheet/${name}`)
            .then(res => res.json())
            .then(data => {
                setLoading(null);
                if (data.length && data[0].length == 4) {
                    const words = data.filter(row =>
                        (row[0] == 'TRUE' || row[0] == 'FALSE')
                        && (row[1].length)
                        && (row[2].length)
                        && (row[3] == 'TRUE' || row[3] == 'FALSE')
                    );
                    setSheet(name);
                    setRawWords(data);
                    setWords(words);
                } else {
                    alert('The sheet format is not proper');
                }
            });
    }

    return <ul className="sheets">
        { sheets.map( name => <Sheet name={name} onClick={onSheetClick} loading={loading} /> )}
    </ul>
}