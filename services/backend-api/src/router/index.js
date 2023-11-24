const { Router } = require('express');
const { API_ROUTE_PATHS } = require('./routes');
const { textSummarizationController } = require('../controllers/summarizeText');
const { newsContentController } = require('../controllers/newsContent');
const { userAuthenticationController } = require('../controllers/userAuthentication');

const router = Router();

router.get(API_ROUTE_PATHS.NEWS_CONTENT, newsContentController);
router.post(API_ROUTE_PATHS.SUMMARIZE_TEXT, textSummarizationController);
router.post(API_ROUTE_PATHS.LOGIN, userAuthenticationController);

module.exports = router;