import React from 'react';
import { API_PATHS, axiosInstance } from '../../utils/httpUtils';
import WordChip from '../../WordChip';
import { BOOKMARK_WORD_LIMIT, styles } from '../IndexPage';

export const BookmarkPanel = ({ bookmarkWords, setBookmarkWords, keyword, setKeyword, isClearingAllBookmarkWords, setIsClearingAllBookmarkWords }) => {
    const isBookmarkWordLimitReached = bookmarkWords.length >= BOOKMARK_WORD_LIMIT;

    const clearAllBookmarkWords = async () => {
        try {
            const hasConfirmed = window.confirm("Confirm to clear all bookmarked words?");
            if (hasConfirmed) {
                setIsClearingAllBookmarkWords(true);
                await axiosInstance.delete(API_PATHS.bookmarkWords);
                setBookmarkWords([]);
                setIsClearingAllBookmarkWords(false);
            }
        } catch (error) {
            console.error("Error clearing bookmark words:", error);
            alert("Error clearing bookmark words. Please try again later.");
            setIsClearingAllBookmarkWords(false);
        }
    };

    const addBookmarkWord = async () => {
        const wordToBookmark = keyword;
        setBookmarkWords([...bookmarkWords, wordToBookmark]);
        axiosInstance.post(API_PATHS.bookmarkWord, { word: wordToBookmark })
            .then(() => {
                console.log("Word added");
            })
            .catch((error) => {
                console.error("Error adding word:", error);
            });
    };

    return (
        <>
            <button disabled={isBookmarkWordLimitReached || bookmarkWords.includes(keyword)} onClick={addBookmarkWord}>
                Bookmark
            </button>
            {isBookmarkWordLimitReached && !isClearingAllBookmarkWords && <div>You can only bookmark {BOOKMARK_WORD_LIMIT} words. Please delete a word to add a new one.</div>}
            {isClearingAllBookmarkWords && <p>Clearing all bookmarked words...</p>}

            {!isClearingAllBookmarkWords && (
                <div style={styles.wordChipContainer}>
                    {bookmarkWords.map((word, index) => (
                        <WordChip
                            key={index}
                            word={word}
                            onEdit={(newWord) => {
                                const newBookmarkWords = bookmarkWords.map((w) => w === word ? newWord : w);
                                setBookmarkWords(newBookmarkWords);
                            }}
                            onClick={() => setKeyword(word)}
                            onDelete={() => setBookmarkWords(bookmarkWords.filter((w) => w !== word))} />
                    ))}
                    {bookmarkWords.length === 0
                        ? <p>No bookmarked words to display</p>
                        : <button style={styles.clearAllBookmarkWordsButton} onClick={clearAllBookmarkWords}>Clear all bookmarked words</button>}
                </div>
            )}
        </>
    );
};
