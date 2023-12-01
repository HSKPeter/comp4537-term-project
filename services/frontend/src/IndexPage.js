// src/IndexPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_PATHS, HTTP_STATUS_CODES, axiosInstance } from './utils/httpUtils';
import Navbar from './Navbar';
import { navigateToLoginPageIfRoleNotFound } from './utils/securityUtils';
import WordChip from './WordChip';

const styles = {
    wordChipContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
}

const IndexPage = () => {
    const [keyword, setKeyword] = useState('');
    const [bookmarkWords, setBookmarkWords] = useState([]); // TODO: fetch from API '/bookmarks
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function syncBookmarkWordsWithBackend() {
            const response = await axiosInstance.get(API_PATHS.bookmarkWord);
            if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
                navigate('/login', { state: { from: location } });
                return;
            }
            setBookmarkWords(response.data.bookmarkWords);
        }

        navigateToLoginPageIfRoleNotFound(navigate, location)
            .then(() => syncBookmarkWordsWithBackend());
    }, []);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${API_PATHS.news}?keyword=${keyword}`);
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
                <button disabled={bookmarkWords.length >= 2 || bookmarkWords.includes(keyword)} onClick={addBookmarkWord}>
                    Bookmark
                </button>
                <button onClick={fetchNews} disabled={loading}>
                    {loading ? 'Loading...' : 'Get News'}
                </button>

                <div style={styles.wordChipContainer}>
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
                </div>

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
