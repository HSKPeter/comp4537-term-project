// src/IndexPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_PATHS, HTTP_STATUS_CODES, ROUTER_PATHS, axiosInstance } from '../utils/httpUtils';
import { navigateToLoginPageIfRoleNotFound } from '../utils/securityUtils';
import { BookmarkPanel } from './components/BookmarkPanel';
import { NewsDisplayPanel } from './components/NewsDisplayPanel';
import { LoadingBookmarkWordsContext } from '../context/LoadingBookmarkWords';
import { displayWarningIfExceedApiLimit } from '../utils/warningUtils';
import { USER_MESSAGES_EN } from '../utils/userMessages';

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
    const [isLoadingBookmarkWords, setIsLoadingBookmarkWords] = useState(true);
    const [errorMessage, setErrorMessage] = useState();
    const location = useLocation();
    const navigate = useNavigate();

    const keywordNotEmpty = keyword.trim() !== "";

    useEffect(() => {
        async function syncBookmarkWordsWithBackend() {
            try {
                const response = await axiosInstance.get(API_PATHS.bookmarkWords);
                setBookmarkWords(response.data.words ?? []);
                setIsLoadingBookmarkWords(false);
            } catch (error) {
                console.error("Error fetching bookmark words:", error);
            }
        }

        navigateToLoginPageIfRoleNotFound(navigate, location)
            .then((isRoleFound) => {
                if (isRoleFound) {
                    syncBookmarkWordsWithBackend();
                }
            });
    }, [location, navigate]);

    const handleInputChange = (e) => {
        const filteredValue = e.target.value.replace(/[^a-zA-Z0-9]/g, '');
        setKeyword(filteredValue);
    };

    const fetchNews = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const url = keywordNotEmpty ? `${API_PATHS.searchNews}?keyword=${keyword}` : API_PATHS.trendingNews;
            
            const response = await axiosInstance.get(url);
            if (response.status === HTTP_STATUS_CODES.UNAUTHORIZED) {
                navigate(ROUTER_PATHS.login, { state: { from: location } });
                return;
            }
            setNews(response.data);

            displayWarningIfExceedApiLimit(response);
        } catch (error) {
            console.error("Error fetching news:", error);
            setErrorMessage(USER_MESSAGES_EN.index_page_error_fetching_news);
        }
        setLoading(false);
    };

    return (
        <>
            <div>
                <input
                    type="text"
                    value={keyword}
                    onChange={handleInputChange}
                    placeholder={USER_MESSAGES_EN.index_page_keyword_input_placeholder}
                />
                {keywordNotEmpty
                    ? <button onClick={fetchNews} disabled={loading}>
                        {loading ? USER_MESSAGES_EN.index_page_search_news_button_loading : USER_MESSAGES_EN.index_page_search_news_button_default}
                    </button>
                    : <button onClick={fetchNews} disabled={loading}>
                        {loading ? USER_MESSAGES_EN.index_page_get_trending_news_button_loading : USER_MESSAGES_EN.index_page_get_trending_news_button_default}
                    </button>
                }
                {errorMessage && <p>{errorMessage}</p>}
                <LoadingBookmarkWordsContext.Provider value={{ isLoadingBookmarkWords, setIsLoadingBookmarkWords }}>
                    <BookmarkPanel
                        bookmarkWords={bookmarkWords}
                        setBookmarkWords={setBookmarkWords}
                        keyword={keyword}
                        setKeyword={setKeyword}
                    />
                </LoadingBookmarkWordsContext.Provider>

                <NewsDisplayPanel news={news} />
            </div>
        </>
    );
};

export default IndexPage;

