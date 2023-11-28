const { Router } = require('express');
const { API_ROUTE_PATHS } = require('./routes');
const {
    textSummarizationController,
    newsContentController,
    userLoginController,
    userRegistrationController,
    userLogoutController
} = require('../controllers');
const { checkUserQuota } = require('../middlewares/checkUserQuota');
const { roleValidationController } = require('../controllers/roleValidation');

const router = Router();

router.post(API_ROUTE_PATHS.LOGIN, userLoginController);
router.post(API_ROUTE_PATHS.REGISTER, userRegistrationController);
router.get(API_ROUTE_PATHS.ROLE, roleValidationController);

router.use(checkUserQuota);

// In production, the routes below require a valid token to be present either in the Authorization header or in the cookies
router.get(API_ROUTE_PATHS.NEWS_CONTENT, newsContentController);
router.post(API_ROUTE_PATHS.SUMMARIZE_TEXT, textSummarizationController);
router.post(API_ROUTE_PATHS.LOGOUT, userLogoutController);

module.exports = router;