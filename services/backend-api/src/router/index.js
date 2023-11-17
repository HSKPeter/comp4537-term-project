const { Router } = require('express');
const { API_ROUTE_PATHS } = require('./routes');
const { ROUTE_CONTROLLERS } = require('./routeControllers');

const router = Router();

router.get(API_ROUTE_PATHS.ROOT, ROUTE_CONTROLLERS.root);
router.post(API_ROUTE_PATHS.SUMMARIZE_TEXT, ROUTE_CONTROLLERS.summarize);

module.exports = router;