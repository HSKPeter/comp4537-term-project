const { textSummarizationController } = require('./summarizeText');
const { newsContentController } = require('./newsContent');
const { userLoginController } = require('./userLogin');
const { userRegistrationController } = require('./userRegistration');
const { userLogoutController } = require('./userLogout');
const { apiConsumptionController } = require('./apiConsumption');
const { apiStatsByUserController } = require('./apiStatsByUser');
const { apiStatsController } = require('./apiStats');

module.exports = {
    userLoginController,
    userLogoutController,
    userRegistrationController,
    textSummarizationController,
    newsContentController,
    apiConsumptionController,
    apiStatsByUserController,
    apiStatsController
};