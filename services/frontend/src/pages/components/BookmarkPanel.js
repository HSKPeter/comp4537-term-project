import React, { useContext } from 'react';
import { LoadingBookmarkWordsContext } from '../../context/LoadingBookmarkWords';
import { API_PATHS, axiosInstance } from '../../utils/httpUtils';
import WordChip from '../../WordChip';
import { BOOKMARK_WORD_LIMIT, styles } from '../IndexPage';

export const BookmarkPanel = ({ bookmarkWords, setBookmarkWords, keyword, setKeyword }) => {
    const { isLoadingBookmarkWords, setIsLoadingBookmarkWords } = useContext(LoadingBookmarkWordsContext);

    const isBookmarkWordLimitReached = bookmarkWords.length >= BOOKMARK_WORD_LIMIT;

    const clearAllBookmarkWords = async () => {
        try {
            const hasConfirmed = window.confirm("Confirm to clear all bookmarked words?");
            if (hasConfirmed) {
                setIsLoadingBookmarkWords(true);
                await axiosInstance.delete(API_PATHS.bookmarkWords + `?all=true`);
                setBookmarkWords([]);
                setIsLoadingBookmarkWords(false);
            }
        } catch (error) {
            console.error("Error clearing bookmark words:", error);
            alert("Error clearing bookmark words. Please try again later.");
            setIsLoadingBookmarkWords(false);
        }
    };

    const addBookmarkWord = async () => {
        const wordToBookmark = keyword;
        setIsLoadingBookmarkWords(true);
        axiosInstance.post(API_PATHS.bookmarkWords, { word: wordToBookmark })
            .then(() => {
                console.log("Word added");
                setBookmarkWords([...bookmarkWords, wordToBookmark]);
            })
            .catch((error) => {
                console.error("Error adding word:", error);
            })
            .finally(() => {
                setIsLoadingBookmarkWords(false);
            });
    };

    return (
        <>
            <button disabled={isBookmarkWordLimitReached || bookmarkWords.includes(keyword)} onClick={addBookmarkWord}>
                Bookmark
            </button>
            {isBookmarkWordLimitReached && !isLoadingBookmarkWords && <div>You can only bookmark {BOOKMARK_WORD_LIMIT} words. Please delete a word to add a new one.</div>}
            {isLoadingBookmarkWords && <p>Loading...</p>}

            {!isLoadingBookmarkWords && (
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
