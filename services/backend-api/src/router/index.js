const { Router } = require('express');
const { API_ROUTE_PATHS } = require('./routes');
const {
    textSummarizationController,
    newsContentController,
    loginUserController,
    registerUserController
} = require('../controllers');

const router = Router();

router.post(API_ROUTE_PATHS.LOGIN, loginUserController);
router.post(API_ROUTE_PATHS.REGISTER, registerUserController);
router.get(API_ROUTE_PATHS.NEWS_CONTENT, newsContentController);
router.post(API_ROUTE_PATHS.SUMMARIZE_TEXT, textSummarizationController);

module.exports = router;