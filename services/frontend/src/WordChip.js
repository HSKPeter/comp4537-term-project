// src/WordChip.js

import React, { useState, useContext } from 'react';
import { axiosInstance } from './utils/httpUtils';
import { LoadingBookmarkWordsContext } from './context/LoadingBookmarkWords';
import { displayWarningIfExceedApiLimit } from './utils/warningUtils';

const styles = {
    wordChip: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#e0e0e0',
        borderRadius: '5px',
        padding: '5px',
        margin: '5px',
        width: 'fit-content',
        color: '#333',
    },
    word: {
        marginRight: '5px',
        cursor: 'pointer',
    },
    deleteButton: {
        cursor: 'pointer',
        color: 'red',
        fontWeight: 'bold',
        margin: '0 5px',
    },
    editButton: {
        cursor: 'pointer',
        color: 'blue',
        fontWeight: 'bold',
        margin: '0 5px',
    },
    confirmButton: {
        cursor: 'pointer',
        color: 'green',
        fontWeight: 'bold',
        margin: '0 5px',
    },
    inputField: {
        marginRight: '5px',
    }
};

const SYMBOLS = {
    EDIT: '✎',
    DELETE: 'x',
    CONFIRM: '✔',
};

const WordChip = ({ word, onDelete, onClick, onEdit }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [newWord, setNewWord] = useState(word);
    const { setIsLoadingBookmarkWords } = useContext(LoadingBookmarkWordsContext);

    const updateWord = (e) => {
        e.stopPropagation();
        setIsEditMode(false);
        setIsLoadingBookmarkWords(true);
        axiosInstance.put('/bookmark-words', { originalWord: word, newWord })
            .then((response) => {
                console.log(`Word edited: ${word} to ${newWord}`)
                displayWarningIfExceedApiLimit(response);
                onEdit(newWord);
            })
            .catch((error) => {
                console.error(`Error editing word: ${word} to ${newWord}`, error);
            })
            .finally(() => {
                setIsLoadingBookmarkWords(false);
            });
    }

    const deleteWord = (e) => {
        e.stopPropagation();
        setIsLoadingBookmarkWords(true);
        axiosInstance.delete('/bookmark-words', { data: { word } })
            .then((response) => {
                console.log(`Word deleted: ${word}`)
                displayWarningIfExceedApiLimit(response);
                onDelete(word);
            })
            .catch((error) => {
                console.error(`Error deleting word: ${word}`, error);
            })
            .finally(() => {
                setIsLoadingBookmarkWords(false);
            });
    }

    if (!isEditMode) {
        return (
            <div style={styles.wordChip}>
                <span style={styles.word} onClick={() => onClick(word)}>{word}</span>
                <button style={styles.editButton} onClick={(e) => {
                    e.stopPropagation();
                    setIsEditMode(true);
                }}>{SYMBOLS.EDIT}</button>
                <button style={styles.deleteButton} onClick={deleteWord}>
                    {SYMBOLS.DELETE}
                </button>
            </div>
        );
    }


    return (
        <div style={styles.wordChip}>
            <input style={styles.inputField} type="text" value={newWord} onChange={(e) => setNewWord(e.target.value)} />
            <button style={styles.confirmButton} disabled={newWord === word} onClick={updateWord}>{SYMBOLS.CONFIRM}</button>
        </div>
    );
}

export default WordChip;