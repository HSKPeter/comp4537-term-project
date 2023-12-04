const { Router } = require('express');
const { API_ROUTE_PATHS } = require('./routes');
const {
    textSummarizationController,
    searchNewsController,
    getTrendingNewsController,
    userLoginController,
    userRegistrationController,
    userLogoutController,
    apiConsumptionController,
    // TODO: Uncomment these when the real implementation is ready
    // apiStatsByUserController,
    // apiStatsController,
    getBookmarkWordsController,
    addBookmarkWordController,
    editBookmarkWordController,
    deleteBookmarkWordController,
} = require('../controllers');
const { checkUserQuota } = require('../middlewares/checkUserQuota');
const { roleValidationController } = require('../controllers/roleValidation');
const { checkAdminRole } = require('../middlewares/checkAdminRole');
const { IS_DEVELOPMENT_MODE } = require('../config');
const { mimicNetworkLatency } = require('../middlewares/mimicNetworkLatency');
const { recordApiUsage } = require('../middlewares/recordApiUsage');

const router = Router();

router.use(checkAdminRole);
router.use(checkUserQuota);
router.use(recordApiUsage);

if (IS_DEVELOPMENT_MODE) {
    router.use(mimicNetworkLatency);
}

router.post(API_ROUTE_PATHS.LOGIN, userLoginController);
router.post(API_ROUTE_PATHS.REGISTER, userRegistrationController);
router.post(API_ROUTE_PATHS.LOGOUT, userLogoutController);
router.get(API_ROUTE_PATHS.ROLE, roleValidationController);

// router.get(API_ROUTE_PATHS.API_STATS, apiStatsController);
// TODO: Replace with the real implementation
router.get(API_ROUTE_PATHS.API_STATS, (req, res) => {
    const API_USAGE_DATA = {
        "usageStats": [
            {
                "api-name": "API 1",
                "request-type": "GET",
                "count": 100
            },
            {
                "api-name": "API 2",
                "request-type": "POST",
                "count": 75
            },
            {
                "api-name": "API 3",
                "request-type": "GET",
                "count": 120
            },
            {
                "api-name": "API 4",
                "request-type": "PUT",
                "count": 50
            }
        ]
    }

    res.json(API_USAGE_DATA);
});

// router.get(API_ROUTE_PATHS.API_STATS_BY_USER, apiStatsByUserController);
// TODO: Replace with the real implementation
router.get(API_ROUTE_PATHS.API_STATS_BY_USER, (req, res) => {
    const USER_DATA = {
        "users-info": [
            {
                "username": "user1",
                "email": "user1@example.com",
                "role": "admin",
                "apiConsumption": 150
            },
            {
                "username": "user2",
                "email": "user2@example.com",
                "role": "user",
                "apiConsumption": 80
            },
            {
                "username": "user3",
                "email": "user3@example.com",
                "role": "user",
                "apiConsumption": 120
            },
            {
                "username": "user4",
                "email": "user4@example.com",
                "role": "admin",
                "apiConsumption": 200
            }
        ]
    }
    res.json(USER_DATA);
});

router.get(API_ROUTE_PATHS.API_CONSUMPTION, apiConsumptionController);

router.get(API_ROUTE_PATHS.SEARCH_NEWS, searchNewsController);
router.get(API_ROUTE_PATHS.TRENDING_NEWS, getTrendingNewsController);
router.post(API_ROUTE_PATHS.SUMMARIZE_TEXT, textSummarizationController);

router.get(API_ROUTE_PATHS.BOOKMARK_WORDS, getBookmarkWordsController);
router.post(API_ROUTE_PATHS.BOOKMARK_WORDS, addBookmarkWordController);
router.put(API_ROUTE_PATHS.BOOKMARK_WORDS, editBookmarkWordController);
router.delete(API_ROUTE_PATHS.BOOKMARK_WORDS, deleteBookmarkWordController);

module.exports = router;