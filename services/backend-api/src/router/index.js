const { Router } = require('express');
const { API_ROUTE_PATHS } = require('./routes');
const {
    textSummarizationController,
    newsContentController,
    userLoginController,
    userRegistrationController,
    adminReadController,
    adminCreateController,
    adminUpdateController,
    adminDeleteController,

} = require('../controllers');
const { checkUserQuota } = require('../middlewares/checkUserQuota');
const { IS_PRODUCTION_MODE } = require('../config');

const router = Router();

router.post(API_ROUTE_PATHS.LOGIN, userLoginController);
router.post(API_ROUTE_PATHS.REGISTER, userRegistrationController);

router.get(API_ROUTE_PATHS.READ_ALL_FIELDS, adminReadController);
router.post(API_ROUTE_PATHS.CREATE_ENTRY, adminCreateController);
router.put(API_ROUTE_PATHS.UPDATE_ENTRY, adminUpdateController);
router.delete(API_ROUTE_PATHS.DELETE_ENTRY, adminDeleteController);

if (IS_PRODUCTION_MODE) {  // TODO: Remove this check once the auth server is implemented
    router.use(checkUserQuota);
}

// In production, the routes below require a valid token to be present either in the Authorization header or in the cookies
router.get(API_ROUTE_PATHS.NEWS_CONTENT, newsContentController);
router.post(API_ROUTE_PATHS.SUMMARIZE_TEXT, textSummarizationController);

module.exports = router;