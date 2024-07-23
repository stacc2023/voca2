import './App.scss';
import React, { useContext, useEffect, useState, } from 'react';
import Sheets from './components/sheets';
import CardFrame from './components/card';
import { AppContext } from './context';


function App() {
    const [sheets, setSheets] = useState([]);
    const { words, setWords, } = useContext(AppContext);

    
    useEffect(() => {
        fetch('/sheets')
            .then(res => res.json())
            .then(data => setSheets(data));
    }, []);

    return (
        <div className="App">
            {sheets.length ? 
                <Sheets sheets={sheets} />
                : 'loading list of voca...'}
            {words.length ?
                <CardFrame /> 
                : null}
        </div>
    );
}

export default App;
