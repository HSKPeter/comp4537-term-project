// src/WordChip.js

import React, { useState } from 'react';
import { axiosInstance } from './utils/httpUtils';

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
                        axiosInstance.delete('/bookmark-word', { data: { word } })
                            .then(() => {
                                console.log(`Word deleted: ${word}`)
                            })
                            .catch((error) => {
                                console.error(`Error deleting word: ${word}`, error);
                            });
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
                axiosInstance.put('/bookmark-word', { originalWord: word, newWord })
                    .then(() => {
                        console.log(`Word edited: ${word} to ${newWord}`)
                    })
                    .catch((error) => {
                        console.error(`Error editing word: ${word} to ${newWord}`, error);
                    });
                onEdit(newWord);
            }
            }> ✔</span>
        </div>
    );
}

export default WordChip;