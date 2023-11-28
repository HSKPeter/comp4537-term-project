// src/IndexPage.js
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_PATHS, HTTP_STATUS_CODES, axiosInstance } from './utils/httpUtils';
import { getUserRole, getUserRoleFromCache } from './utils/userRoleUtils';

const IndexPage = () => {
    const [keyword, setKeyword] = useState('');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function navigateToLoginPageIfRoleNotFound() {
            let role = getUserRoleFromCache();
            if (!role) {
                navigate('/login', { state: { from: location } });
                return;
            }

            role = await getUserRole();
            if (!role) {
                navigate('/login', { state: { from: location } });
                return;
            }
        }

        navigateToLoginPageIfRoleNotFound();
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
    );
};

export default IndexPage;
