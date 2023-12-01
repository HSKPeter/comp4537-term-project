// src/WordChip.js

import React from 'react';

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
};

const WordChip = ({ word, onDelete, onClick }) => {
    return (
        <div style={styles.wordChip} onClick={() => onClick(word)}>
            <span style={styles.word}>{word}</span>
            <span
                style={styles.deleteButton}
                onClick={(e) => {
                    e.stopPropagation(); // Prevents onClick from being called on parent div
                    onDelete(word);
                }}
            >
                x
            </span>
        </div>
    );
}

export default WordChip;