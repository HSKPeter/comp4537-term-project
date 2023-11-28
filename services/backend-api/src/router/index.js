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
const { checkAdminRole } = require('../middlewares/checkAdminRole');

const router = Router();

router.use(checkAdminRole);
router.use(checkUserQuota);

router.post(API_ROUTE_PATHS.LOGIN, userLoginController);
router.post(API_ROUTE_PATHS.REGISTER, userRegistrationController);
router.post(API_ROUTE_PATHS.LOGOUT, userLogoutController);
router.get(API_ROUTE_PATHS.ROLE, roleValidationController);
router.get(API_ROUTE_PATHS.NEWS_CONTENT, newsContentController);
router.post(API_ROUTE_PATHS.SUMMARIZE_TEXT, textSummarizationController);

module.exports = router;