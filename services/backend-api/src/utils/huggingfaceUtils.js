const axios = require('axios');
const { HUGGINGFACE_API_TOKEN } = require('../config');

const API_ENDPOINT = "https://api-inference.huggingface.co/models/google/pegasus-large";

const AUTHORIZATION_HEADER = { Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}` };

async function summarizeText(inputs) {
    const data = { inputs };
    const response = await axios.post(API_ENDPOINT, data, { headers: AUTHORIZATION_HEADER });
    const result = response.data;
    const textSummary = result[0].summary_text;
    return textSummary;
}

module.exports = {
    summarizeText
};
