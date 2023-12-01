const { textSummarizationController } = require('./summarizeText');
const { newsContentController } = require('./newsContent');
const { userLoginController } = require('./userLogin');
const { userRegistrationController } = require('./userRegistration');
const { userLogoutController } = require('./userLogout');
const apiStatsControllers = require('./apiStats');
const bookmarkWordControllers = require('./bookmarkWord');

module.exports = {
    userLoginController,
    userLogoutController,
    userRegistrationController,
    textSummarizationController,
    newsContentController,
    ...apiStatsControllers,
    ...bookmarkWordControllers
};