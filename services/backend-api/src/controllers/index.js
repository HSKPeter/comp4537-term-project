const { textSummarizationController } = require('./summarizeText');
const { userLoginController } = require('./userLogin');
const { userRegistrationController } = require('./userRegistration');
const { userLogoutController } = require('./userLogout');
const newsControllers = require('./newsContent');
const apiStatsControllers = require('./apiStats');
const bookmarkWordControllers = require('./bookmarkWord');

module.exports = {
    userLoginController,
    userLogoutController,
    userRegistrationController,
    textSummarizationController,
    ...newsControllers,
    ...apiStatsControllers,
    ...bookmarkWordControllers
};