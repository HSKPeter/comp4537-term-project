const fs = require('fs');
const axios = require('axios');
const path = require('path');


const { NEWS_DATA_API_KEY, IS_DEVELOPMENT_MODE } = require('../config');

const NEWS_API = "https://newsdata.io/api/1/news";

const EN_LOCALE = 'en';

const SAMPLE_NEWS_RESPONSE_JSON_FILE_PATH = path.join(__dirname, 'sampleNewsResponse.json');
const SAMPLE_TRENDING_NEWS_RESPONSE_JSON_FILE_PATH = path.join(__dirname, 'sampleTrendingNewsResponse.json');

const SEARCH_PARAMS = {
  QUERY: 'q',
  API_KEY: 'apikey',
  LANGUAGE: 'language',
}


async function searchNews(query) {
  const url = new URL(NEWS_API);
  url.searchParams.append(SEARCH_PARAMS.QUERY, query);
  url.searchParams.append(SEARCH_PARAMS.API_KEY, NEWS_DATA_API_KEY);
  url.searchParams.append(SEARCH_PARAMS.LANGUAGE, EN_LOCALE);

  const response = IS_DEVELOPMENT_MODE
    ? readSampleResponseFromLocalFile(SAMPLE_NEWS_RESPONSE_JSON_FILE_PATH)
    : await axios.get(url);

  return response.data.results.map(mapNewsResult);
}

async function getTrendingNews() {
  const url = new URL(NEWS_API);
  url.searchParams.append(SEARCH_PARAMS.API_KEY, NEWS_DATA_API_KEY);
  url.searchParams.append(SEARCH_PARAMS.LANGUAGE, EN_LOCALE);

  const response = IS_DEVELOPMENT_MODE
    ? readSampleResponseFromLocalFile(SAMPLE_TRENDING_NEWS_RESPONSE_JSON_FILE_PATH)
    : await axios.get(url);

  return response.data.results.map(mapNewsResult);
}

function readSampleResponseFromLocalFile(filepath) {
  const jsonFileContent = fs.readFileSync(filepath);
  const data = JSON.parse(jsonFileContent);
  return { data };
}

function mapNewsResult(newsResult) {
  return {
    title: newsResult.title,
    link: newsResult.link,
    content: newsResult.content,
    published: newsResult.pubDate,
  }
}

module.exports = {
  searchNews,
  getTrendingNews
}
