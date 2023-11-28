const { textSummarizationController } = require('./summarizeText');
const { newsContentController } = require('./newsContent');
const { userLoginController } = require('./userLogin');
const { userRegistrationController } = require('./userRegistration');
const { adminReadController } = require('./adminRead');
const { adminCreateController } = require('./adminCreate');
const { adminUpdateController } = require('./adminUpdate');
const { adminDeleteController } = require('./adminDelete');

module.exports = {
    userLoginController,
    userRegistrationController,
    textSummarizationController,
    newsContentController,
    adminReadController,
    adminCreateController,
    adminUpdateController,
    adminDeleteController,
};
