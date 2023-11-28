const axios = require('axios');

const REGISTER_JSON = require('./dummyData/register.json');

// Specify the endpoint URL
const ENDPOINT_URL = 'https://patrickcammayo.com/COMP4537/project/api/v1/authentication/';

const RESOURCES = {
    USER: 'user',
    REGISTER: 'register',
    LOGIN: 'login',
};



function makePostRequest(endpointUrl, requestBody) {
    axios.post(endpointUrl, requestBody)
        .then(response => {
            console.log('Response:', response.data);
        })
        .catch(error => {
            console.error('Error:', error.message);
        });
}

function registerUsers() {
    for (let i = 0; i < REGISTER_JSON.length; i++) {
        const requestBody = REGISTER_JSON[i];
        makePostRequest(ENDPOINT_URL + RESOURCES.REGISTER, requestBody);
    }
}

registerUsers();

