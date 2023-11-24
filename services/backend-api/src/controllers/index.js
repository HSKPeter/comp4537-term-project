const {loginUserController} = require('./login');
const {registerUserController} = require('./register');
const {textSummarizationController} = require('./summarizeText');
const {newsContentController} = require('./newsContent');

module.exports = {
    loginUserController,
    registerUserController,
    textSummarizationController,
    newsContentController
};