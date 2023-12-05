import React, { useContext } from 'react';
import { LoadingBookmarkWordsContext } from '../../context/LoadingBookmarkWords';
import { API_PATHS, axiosInstance } from '../../utils/httpUtils';
import WordChip from '../../WordChip';
import { BOOKMARK_WORD_LIMIT, styles } from '../IndexPage';
import { displayWarningIfExceedApiLimit } from '../../utils/warningUtils';
import { USER_MESSAGES_EN } from '../../utils/userMessages';


export const BookmarkPanel = ({ bookmarkWords, setBookmarkWords, keyword, setKeyword }) => {
    const { isLoadingBookmarkWords, setIsLoadingBookmarkWords } = useContext(LoadingBookmarkWordsContext);

    const isBookmarkWordLimitReached = bookmarkWords.length >= BOOKMARK_WORD_LIMIT;

    const clearAllBookmarkWords = async () => {
        try {
            const hasConfirmed = window.confirm(USER_MESSAGES_EN.bookmark_panel_confirm_clear_all);
            if (hasConfirmed) {
                setIsLoadingBookmarkWords(true);
                const response = await axiosInstance.delete(API_PATHS.bookmarkWords + `?all=true`);
                displayWarningIfExceedApiLimit(response);
                setBookmarkWords([]);
                setIsLoadingBookmarkWords(false);
            }
        } catch (error) {
            console.error("Error clearing bookmark words:", error);
            alert(USER_MESSAGES_EN.bookmark_panel_error_clearing);
            setIsLoadingBookmarkWords(false);
        }
    };

    const addBookmarkWord = async () => {
        const wordToBookmark = keyword;
        setIsLoadingBookmarkWords(true);
        axiosInstance.post(API_PATHS.bookmarkWords, { word: wordToBookmark })
            .then((response) => {
                console.log("Word added");
                setBookmarkWords([...bookmarkWords, wordToBookmark]);
                displayWarningIfExceedApiLimit(response);
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
            <button disabled={isLoadingBookmarkWords || isBookmarkWordLimitReached || bookmarkWords.includes(keyword)} onClick={addBookmarkWord}>
                {USER_MESSAGES_EN.bookmark_panel_bookmark_button}
            </button>
            {isBookmarkWordLimitReached && !isLoadingBookmarkWords && <div>{USER_MESSAGES_EN.bookmark_panel_limit_reached.replace("{0}", BOOKMARK_WORD_LIMIT)}</div>}
            {isLoadingBookmarkWords && <p>{USER_MESSAGES_EN.bookmark_panel_loading}</p>}

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
                        ? <p>{USER_MESSAGES_EN.bookmark_panel_no_bookmarks}</p>
                        : <button style={styles.clearAllBookmarkWordsButton} onClick={clearAllBookmarkWords}>{USER_MESSAGES_EN.bookmark_panel_clear_all_button}</button>}
                </div>
            )}
        </>
    );
};
