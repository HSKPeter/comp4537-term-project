const axios = require('axios');
const { HUGGINGFACE_API_TOKEN } = require('../config');
const { SERVER_MESSAGES } = require('../messages/serverMessage');

const API_ENDPOINTS = {
    HUGGING_FACE: "https://api-inference.huggingface.co/models/google/pegasus-large",
    SELF_HOSTED: "https://wvqsafjoz3rns5yc4ly4iqbkg40coydg.lambda-url.us-east-2.on.aws/"
}
const HF_AUTHORIZATION_HEADER = { Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}` };


async function summarizeTextWithHuggingFace(inputs) {
    console.log(SERVER_MESSAGES.models.useHfApi);
    const data = { inputs };
    const response = await axios.post(API_ENDPOINTS.HUGGING_FACE, data, { headers: HF_AUTHORIZATION_HEADER });
    const result = response.data;
    const textSummary = result[0].summary_text;
    return textSummary;
}

async function summarizeTextWithSelfHostedModel(text) {
    const data = { text };
    console.log(SERVER_MESSAGES.models.useSelfHostedModel);
    const response = await axios.post(API_ENDPOINTS.SELF_HOSTED, data);
    const result = response.data;
    return result.summary;
}

async function summarizeText(inputs) {
    try {
        const textSummary = await summarizeTextWithSelfHostedModel(inputs);
        console.log(SERVER_MESSAGES.models.successSelfHostedModel);
        return textSummary;
    } catch (error) {
        console.log(error);
        const textSummary = await summarizeTextWithHuggingFace(inputs);
        console.log(SERVER_MESSAGES.models.successHfApi);
        return textSummary;
    }
}

module.exports = {
    summarizeText
};
