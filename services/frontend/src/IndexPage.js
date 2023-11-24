// src/LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';

const IndexPage = ({ onLogout }) => {
    const [keyword, setKeyword] = useState('');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchNews = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/news?keyword=${keyword}`);
            setNews(response.data);
        } catch (error) {
            console.error("Error fetching news:", error);
            // Handle error accordingly
        }
        setLoading(false);
    };

    return (
        <div>
            <button onClick={onLogout}>Logout</button>
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
