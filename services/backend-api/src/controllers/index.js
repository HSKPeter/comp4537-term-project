const { textSummarizationController } = require('./summarizeText');
const { newsContentController } = require('./newsContent');
const { userLoginController } = require('./userLogin');
const { userRegistrationController } = require('./userRegistration');

module.exports = {
    userLoginController,
    userRegistrationController,
    textSummarizationController,
    newsContentController
};