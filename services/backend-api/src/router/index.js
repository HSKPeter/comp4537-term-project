const { Router } = require('express');
const { API_ROUTE_PATHS } = require('./routes');
const { textSummarizationController } = require('../controllers/summarizeText');
const { newsContentController } = require('../controllers/newsContent');

const router = Router();

router.get(API_ROUTE_PATHS.NEWS_CONTENT, newsContentController);
router.post(API_ROUTE_PATHS.SUMMARIZE_TEXT, textSummarizationController);

module.exports = router;