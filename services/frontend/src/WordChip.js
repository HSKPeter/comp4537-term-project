// src/WordChip.js

import React, { useState } from 'react';

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

const WordChip = ({ word, onDelete, onClick, onEdit }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [newWord, setNewWord] = useState(word);

    if (!isEditMode) {
        return (
            <div style={styles.wordChip} onClick={() => onClick(word)}>
                <span style={styles.word}>{word}</span>
                <span style={styles.editButton} onClick={(e) => {
                    e.stopPropagation();
                    setIsEditMode(true);
                }}>✎</span>
                <span
                    style={styles.deleteButton}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(word);
                    }}
                >
                    x
                </span>
            </div>
        );
    }


    return (
        <div style={styles.wordChip} onClick={() => onClick(word)}>
            <input style={styles.inputField} type="text" value={newWord} onChange={(e) => setNewWord(e.target.value)} />
            <span style={styles.confirmButton} onClick={(e) => {
                e.stopPropagation();
                setIsEditMode(false);
                onEdit(newWord);
            }
            }> ✔</span>
        </div>
    );
}

export default WordChip;