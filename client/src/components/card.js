import { useContext, useEffect, useRef, useState } from "react"
import { AppContext } from "../context";
import axios from 'axios';

function Card({ row }) {
    // row[0] : word toggle, row[1] : word, row[2] : meaning, row[3] : meaning toggle
    const [ toggle, setToggle ] = useState(false);

    let className = 'card-content';
    if (toggle == false && row[0] == 'TRUE') {
        className += ' checked';
    } else if (toggle == true && row[3] == 'TRUE') {
        className += ' checked'
    }

    const handleKeyDown = e => {
        switch (e.key) {
            case 'Enter':
                setToggle(toggle => !toggle);
                break;
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [])

    return (
        <div className={className} onClick={e => {
            setToggle(!toggle);
        }}>
            { toggle ? row[2] : row[1] }
        </div>
    )
}

function Exit({ setWordIndex, setRawWords, setWords, setSheet }) {

    return (
        <button className="card-exit" onClick={e => {
            setWordIndex(0);
            setRawWords([]);
            setWords([]);
            setSheet(null);
        }}>X</button>
    )
}

function Check({ type, onClick }) {
    let text;
    switch (type) {
        case 'l':
            text = 'yes';
            break;
        case 'r':
            text = 'no';
            break;
        case 'p':
            text = '←';
            break;
        case 'n':
            text = '→';
            break;
    }

    return (
        <div className="card-check"
            onClick={onClick}
        >
            { text }
        </div>
    )
}

export default function CardFrame() {
    const { sheet, words, setWords, rawWords, setRawWords, wordIndex, setWordIndex, setSheet } = useContext(AppContext);
    const [ audioUrl, setAudioUrl ] = useState(null);
    const audioRef = useRef(null);

    let className = 'card-frame';

    const handleClickFilter = () => {
        setWords(words.filter(row => row[0] == 'FALSE'));
    }

    const handleClickCheck = async (type) => {
        if (type == 'l') {
            words[wordIndex][0] = 'TRUE';
        }
        if (type == 'r') {
            words[wordIndex][0] = 'FALSE';
        }
        
        if (type == 'p') {
            setWordIndex(index => index - 1)
        } else {
            setWordIndex(index => index + 1)
        }

        if (type == 'l' || type == 'r') {

            const rawIndex = rawWords.indexOf(words[wordIndex]) + 1;

            const res = await fetch('/check', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    sheet,
                    type: 'en', // We will add 'kr',
                    index: rawIndex,
                    value: type == 'l' ? true : type =='r' ? false : null
                })
            });
    
            const data = await res.json();
        }
    }

    const speak = async () => {
        const text = words[wordIndex][1];
        const res = await axios.post('/speak', { text }, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'audio/mp3' }));
        setAudioUrl(url);
    }


    useEffect(() => {
        speak();
        const handleKeyDown = e => {
            switch (e.key) {
                case 'ArrowLeft':
                    handleClickCheck('p');
                    break;
                case 'ArrowRight':
                    handleClickCheck('n');
                    break;
                case 'ArrowUp':
                    handleClickCheck('l');
                    break;
                case 'ArrowDown':
                    handleClickCheck('r');
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            console.log('the cardframe useefeect is returned')
            window.removeEventListener('keydown', handleKeyDown);
        }
    }, [wordIndex]);

    useEffect(() => {
        if (audioUrl && audioRef.current) {
            audioRef.current.play();
        }
    }, [audioUrl]);

    return (
        <div className="modal">
            { audioUrl ? <audio ref={audioRef} src={audioUrl} style={{ display: 'none' }} /> : null }
            <div className='upper'>
                <button>reset</button>
                <button onClick={handleClickFilter}>filter</button>
                <Exit setWordIndex={setWordIndex} setRawWords={setRawWords} setWords={setWords} setSheet={setSheet}/>
            </div>
            <div className={className}>
                <header>
                    <div> {wordIndex + 1} / {words.length} </div>
                </header>
                <main>
                    <Check type={'p'} onClick={() => handleClickCheck('p')} />
                    <Card row={words[wordIndex]} />
                    <Check type={'n'} onClick={() => handleClickCheck('n')} />
                </main>
                <footer>
                    <Check type={'l'} onClick={() => handleClickCheck('l')} />
                    <Check type={'r'} onClick={() => handleClickCheck('r')} />
                </footer>
            </div>
        </div>
    )
}