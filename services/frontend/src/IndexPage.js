// src/IndexPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_PATHS, HTTP_STATUS_CODES, axiosInstance } from './utils/httpUtils';
import Navbar from './Navbar';
import { navigateToLoginPageIfRoleNotFound } from './utils/securityUtils';
import WordChip from './WordChip';

const BOOKMARK_WORD_LIMIT = 2;

const styles = {
    wordChipContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    clearAllBookmarkWordsButton: {
        cursor: 'pointer',
        color: 'red',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#e0e0e0',
        borderRadius: '5px',
        padding: '5px',
        margin: '5px',
        width: 'fit-content',
    }
}

const IndexPage = () => {
    const [keyword, setKeyword] = useState('');
    const [bookmarkWords, setBookmarkWords] = useState([]);
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isClearingAllBookmarkWords, setIsClearingAllBookmarkWords] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const keywordNotEmpty = keyword.trim() !== "";
    const isBookmarkWordLimitReached = bookmarkWords.length >= BOOKMARK_WORD_LIMIT;

    useEffect(() => {
        async function syncBookmarkWordsWithBackend() {
            try {
                const response = await axiosInstance.get(API_PATHS.bookmarkWords);
                console.log(response)
                setBookmarkWords(response?.data?.words ?? []);
            } catch (error) {
                console.error("Error fetching bookmark words:", error);
            }
        }

        navigateToLoginPageIfRoleNotFound(navigate, location)
            .then(() => syncBookmarkWordsWithBackend());
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const url = keywordNotEmpty ? `${API_PATHS.searchNews}?keyword=${keyword}` : API_PATHS.trendingNews;

            const response = await axiosInstance.get(url);
            if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
                navigate('/login', { state: { from: location } });
                return;
            }
            setNews(response.data);
        } catch (error) {
            console.error("Error fetching news:", error);
        }
        setLoading(false);
    };

    const clearAllBookmarkWords = async () => {
        try {
            const hasConfirmed = window.confirm("Confirm to clear all bookmarked words?");
            if (hasConfirmed) {
                setIsClearingAllBookmarkWords(true);
                await axiosInstance.delete(API_PATHS.bookmarkWords + `?all=true`);
                setBookmarkWords([]);
                setIsClearingAllBookmarkWords(false);
            }
        } catch (error) {
            console.error("Error clearing bookmark words:", error);
            alert("Error clearing bookmark words. Please try again later.");
            setIsClearingAllBookmarkWords(false);
        }
    }

    const addBookmarkWord = async () => {
        const wordToBookmark = keyword;
        setBookmarkWords([...bookmarkWords, wordToBookmark]);
        axiosInstance.post(API_PATHS.bookmarkWords, { word: wordToBookmark })
            .then(() => {
                console.log("Word added");
            })
            .catch((error) => {
                console.error("Error adding word:", error);
            });
    }

    return (
        <>
            <Navbar />
            <div>
                <input
                    type="text"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Enter keyword"
                />
                <button disabled={isBookmarkWordLimitReached || bookmarkWords.includes(keyword)} onClick={addBookmarkWord}>
                    Bookmark
                </button>
                {keywordNotEmpty
                    ? <button onClick={fetchNews} disabled={loading}>
                        {loading ? 'Loading...' : 'Search News'}
                    </button>
                    : <button onClick={fetchNews} disabled={loading}>
                        {loading ? 'Loading...' : 'Get Trending News'}
                    </button>
                }

                {isBookmarkWordLimitReached && !isClearingAllBookmarkWords && <div>You can only bookmark {BOOKMARK_WORD_LIMIT} words. Please delete a word to add a new one.</div>}
                {isClearingAllBookmarkWords && <p>Clearing all bookmarked words...</p>}

                {!isClearingAllBookmarkWords && <div style={styles.wordChipContainer}>
                    {bookmarkWords.map((word, index) => (
                        <WordChip
                            key={index}
                            word={word}
                            onEdit={(newWord) => {
                                const newBookmarkWords = bookmarkWords.map((w) => {
                                    if (w === word) {
                                        return newWord;
                                    }
                                    return w;
                                });
                                setBookmarkWords(newBookmarkWords);
                            }}
                            onClick={(word) => setKeyword(word)}
                            onDelete={() => setBookmarkWords(bookmarkWords.filter((w) => w !== word))}
                        />))}

                        {
                            bookmarkWords.length === 0 
                            ? <p>No bookmarked words to display</p>
                            : <button style={styles.clearAllBookmarkWordsButton} onClick={clearAllBookmarkWords}>Clear all bookmarked words</button>
                        }
                </div>}

                <div>
                    {news.length ? (
                        news.map((article, index) => (
                            <div key={index}>
                                <h3>{article.title}</h3>
                                <p>{article.content}</p>
                                <a href={article.link} target="_blank" rel="noopener noreferrer">Read more</a>
                                <p>Published: {article.published}</p>
                            </div>
                        ))
                    ) : (
                        <p>No news to display</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default IndexPage;
