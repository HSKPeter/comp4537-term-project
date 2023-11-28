const { textSummarizationController } = require('./summarizeText');
const { newsContentController } = require('./newsContent');
const { userLoginController } = require('./userLogin');
const { userRegistrationController } = require('./userRegistration');
const { userLogoutController } = require('./userLogout');

module.exports = {
    userLoginController,
    userLogoutController,
    userRegistrationController,
    textSummarizationController,
    newsContentController
};