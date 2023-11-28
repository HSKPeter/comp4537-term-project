// src/IndexPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_PATHS, HTTP_STATUS_CODES, axiosInstance } from './utils/httpUtils';
import { getUserRoleFromCache, getUserRole } from './utils/userRoleUtils';
import Navbar from './Navbar';
import { navigateToLoginPageIfRoleNotFound } from './utils/securityUtils';

const IndexPage = () => {
    const [keyword, setKeyword] = useState('');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        navigateToLoginPageIfRoleNotFound(navigate, location);
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
                <button onClick={fetchNews} disabled={loading}>
                    {loading ? 'Loading...' : 'Get News'}
                </button>

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
