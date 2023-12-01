const { textSummarizationController } = require('./summarizeText');
const { newsContentController } = require('./newsContent');
const { userLoginController } = require('./userLogin');
const { userRegistrationController } = require('./userRegistration');
const { userLogoutController } = require('./userLogout');
const { apiConsumptionController } = require('./apiConsumption');
const { apiStatsByUserController } = require('./apiStatsByUser');
const { apiStatsController } = require('./apiStats');
const { getBookmarkWordsController, addBookmarkWordController, editBookmarkWordController, deleteBookmarkWordController } = require('./bookmarkWord');

module.exports = {
    userLoginController,
    userLogoutController,
    userRegistrationController,
    textSummarizationController,
    newsContentController,
    apiConsumptionController,
    apiStatsByUserController,
    apiStatsController,
    getBookmarkWordsController,
    addBookmarkWordController,
    editBookmarkWordController,
    deleteBookmarkWordController
};