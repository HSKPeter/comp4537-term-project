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

module.exports = {
    apiStatsByUserController
}