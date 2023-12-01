// src/IndexPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_PATHS, HTTP_STATUS_CODES, axiosInstance } from '../utils/httpUtils';
import Navbar from './components/Navbar';
import { navigateToLoginPageIfRoleNotFound } from '../utils/securityUtils';
import { BookmarkPanel } from './components/BookmarkPanel';

export const BOOKMARK_WORD_LIMIT = 2;

export const styles = {
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
                setBookmarkWords(response.data.bookmarkWords);
            } catch (error) {
                console.error("Error fetching bookmark words:", error);
            }
        }

        navigateToLoginPageIfRoleNotFound(navigate, location)
            .then(() => {
                syncBookmarkWordsWithBackend();
            });
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
                {keywordNotEmpty
                    ? <button onClick={fetchNews} disabled={loading}>
                        {loading ? 'Loading...' : 'Search News'}
                    </button>
                    : <button onClick={fetchNews} disabled={loading}>
                        {loading ? 'Loading...' : 'Get Trending News'}
                    </button>
                }

                <BookmarkPanel
                    bookmarkWords={bookmarkWords}
                    setBookmarkWords={setBookmarkWords}
                    keyword={keyword}
                    setKeyword={setKeyword}
                    isClearingAllBookmarkWords={isClearingAllBookmarkWords}
                    setIsClearingAllBookmarkWords={setIsClearingAllBookmarkWords}
                />

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
