const { Router } = require('express');
const { API_ROUTE_PATHS } = require('./routes');
const { sampleGetController } = require('../controllers/sample');
const { textSummarizationController } = require('../controllers/summarizeText');
const { userAuthenticationController } = require('../controllers/userAuthentication');

const router = Router();

router.get(API_ROUTE_PATHS.ROOT, sampleGetController);
router.post(API_ROUTE_PATHS.SUMMARIZE_TEXT, textSummarizationController);
router.post(API_ROUTE_PATHS.LOGIN, userAuthenticationController);

module.exports = router;