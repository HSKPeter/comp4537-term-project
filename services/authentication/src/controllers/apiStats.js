const { runSQLQuery } = require('../utils/sqlUtil');

async function apiStatsController(req, res)  {
    try {
        // Fetch API stats
        const apiStats = await getApiStatsFromDatabase();

        // Return API stats
        res.status(200).json({ usageStats: apiStats });

    } catch (err) {
        console.error(`Failed to get API stats from the database: ${err?.stack ?? err}`);
        res.status(500).json({ error: 'Failed to fetch API stats from the database' });
    }
}

async function getApiStatsFromDatabase() {
    try {
        // Query the database to get API stats
        const apiStatsQuery = `
            SELECT
                Endpoint AS 'api-name',
                Method AS 'request-type',
                COUNT(*) AS 'count'
            FROM APICall
            GROUP BY Method, Endpoint;
        `;

        const apiStats = await runSQLQuery(apiStatsQuery);

        return apiStats;
    } catch (error) {
        console.error('Error getting API stats from the database: ', error);
        throw error;
    }
}

module.exports = {
    apiStatsController
}