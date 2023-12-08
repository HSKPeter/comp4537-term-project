import React, { useEffect, useState } from 'react';
import { API_PATHS, axiosInstance } from '../../utils/httpUtils';
import styled from 'styled-components';
import { USER_MESSAGES_EN } from '../../utils/userMessages';


// Styled components
const Card = styled.div`
  background-color: #2a2a2a;
  color: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  transition: all 0.3s ease;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  border: 1px solid #333;
  &:hover {
    border: 1px solid #4b8bec; // A bright color for contrast
  }
`

const Content = styled.div`
  transition: height 0.3s ease;
  overflow: hidden;
`;

const Button = styled.button`
  background-color: #4b8bec; 
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #6699cc; 
  }
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const PublishedDate = styled.p`
  font-size: 0.8em;
  color: #999;
`;

const ReadMoreLink = styled.a`
  color: #4b8bec;
  text-decoration: none;
`;

export function NewsDisplayPanel({ news }) {
    return (
        <div>
            {news.length ? (
                news.map((article, index) => (
                    <NewsItemCard key={index} article={article} />
                ))
            ) : (
                <p>{USER_MESSAGES_EN.news_display_panel_no_news}</p>
            )}
        </div>
    );
}


function NewsItemCard({ article }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [summary, setSummary] = useState();
    const [showSummary, setShowSummary] = useState(false);

    useEffect(() => {
        // Check if summary is already stored in local storage
        const storedSummary = JSON.parse(localStorage.getItem(article.title));
        if (storedSummary) {
            setSummary(storedSummary);
        }
    }, [article.title]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleSummarize = async (event) => {
        event.stopPropagation();
        setShowSummary(!showSummary);
        if (!showSummary || (summary && summary !== USER_MESSAGES_EN.news_item_card_error_summarizing)) {
            return;
        }

        setSummary('loading');
        try {
            const text = article.content;
            const response = await axiosInstance.post(API_PATHS.summarizeText, { text });
            setSummary(response.data.summary);
            setShowSummary(true);
            localStorage.setItem(article.title, JSON.stringify(response.data.summary));
        } catch (error) {
            console.error('Error summarizing article:', error);
            setSummary(USER_MESSAGES_EN.news_item_card_error_summarizing);
        }
    };

    return (
        <Card onClick={toggleExpand}>
            <h3>{article.title}</h3>
            <Content >
                {summary === 'loading' ? (
                    <p>{USER_MESSAGES_EN.news_item_card_loading}</p> // Or replace with a spinner or loading animation
                ) : (
                    <p>{showSummary ? summary : (isExpanded ? article.content : `${article.content.substring(0, 100)}...`)}</p>
                )}
            </Content>
            <ButtonContainer>
                <Button onClick={handleSummarize}>{showSummary ? USER_MESSAGES_EN.news_item_card_button_show_full_article : USER_MESSAGES_EN.news_item_card_button_summarize}</Button>
            </ButtonContainer>
            <ReadMoreLink href={article.link} target="_blank" rel="noopener noreferrer">{USER_MESSAGES_EN.news_item_card_read_more_link}</ReadMoreLink>
            <PublishedDate>{USER_MESSAGES_EN.news_item_card_published_date_prefix} {article.published}</PublishedDate>
            {!showSummary && <p style={{ textAlign: 'center', cursor: "pointer"}}>{isExpanded ? 'Show less' : 'Show more'}</p>}
        </Card >
    );
}

