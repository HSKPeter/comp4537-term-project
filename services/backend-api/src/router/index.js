const { Router } = require('express');
const { API_ROUTE_PATHS } = require('./routes');
const {
    textSummarizationController,
    newsContentController,
    userLoginController,
    userRegistrationController,
    userLogoutController,
    apiConsumptionController,
    apiStatsByUserController,
    apiStatsController,
    getBookmarkWordsController,
    addBookmarkWordController,
    editBookmarkWordController,
    deleteBookmarkWordController
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

router.get(API_ROUTE_PATHS.API_STATS, apiStatsController);
router.get(API_ROUTE_PATHS.API_STATS_BY_USER, apiStatsByUserController);
router.get(API_ROUTE_PATHS.API_CONSUMPTION, apiConsumptionController);

router.get(API_ROUTE_PATHS.NEWS_CONTENT, newsContentController);
router.post(API_ROUTE_PATHS.SUMMARIZE_TEXT, textSummarizationController);

router.get(API_ROUTE_PATHS.BOOKMARK, getBookmarkWordsController);
router.post(API_ROUTE_PATHS.BOOKMARK, addBookmarkWordController);
router.put(API_ROUTE_PATHS.BOOKMARK, editBookmarkWordController);
router.delete(API_ROUTE_PATHS.BOOKMARK, deleteBookmarkWordController);

module.exports = router;