function apiStatsController(req, res) {
    res.json({
        "usageStats": [
            {
                "api-name": "string",
                "request-type": "string",
                "count": 0,
                "user": "string"
            }
        ]
    });
}

function apiStatsByUserController(req, res) {
    res.json({
        "usageStats": [
            {
                "api-name": "string",
                "request-type": "string",
                "count": 0,
                "user": "string"
            }
        ]
    });
}

function apiConsumptionController(req, res) {
    res.json({
        "usageStats": [
            {
                "api-name": "string",
                "request-type": "string",
                "count": 0,
                "user": "string"
            }
        ]
    });
}

module.exports = {
    apiStatsController,
    apiStatsByUserController,
    apiConsumptionController
}