import { createContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [ sheet, setSheet ] = useState(null);
    const [ rawWords, setRawWords ] = useState([]);
    const [ words, setWords ] = useState([]);
    const [ wordIndex, setWordIndexState ] = useState(0);

    const setWordIndex = value => setWordIndexState(index => {
        value = typeof value == 'function' ? value(index) : value;
        if (value >= 0 && value < words.length)
            return value;
        else
            return index;
    });

    return (
        <AppContext.Provider value={{ sheet, setSheet, rawWords, setRawWords, words, setWords, wordIndex, setWordIndex }}>
            { children }
        </AppContext.Provider>
    )
}