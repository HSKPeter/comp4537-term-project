async function apiConsumptionController(req, res) {
    try {
        const { userID } = req.params;

        // Fetch API consumption stats for the specified user ID
        const apiStats = await getApiConsumptionForCurrentUser(userID);

        // Return API consumption stats
        res.status(200).json({ usageStats: apiStats });

    } catch (err) {
        console.error(`Failed to get API consumption stats from the database: ${err?.stack ?? err}`);
        res.status(500).json({ error: 'Failed to fetch API consumption stats from the database' });
    }
}

async function getApiConsumptionForCurrentUser(userID) {
    try {
        const apiConsumptionQuery = `
            SELECT
                Endpoint AS 'api-name',
                Method AS 'request-type',
                COUNT(*) AS 'count'
            FROM APICall
            WHERE UserID = ?
            GROUP BY Method, Endpoint;
        `;

        const apiConsumption = await runSQLQuery(apiConsumptionQuery, [userID]);

        // Transform the result to the desired format
        const formattedApiConsumption = apiConsumption.map(apiStat => ({
            'api-name': apiStat['api-name'],
            'request-type': apiStat['request-type'],
            'count': apiStat['count']
        }));

        return formattedApiConsumption;
    } catch (error) {
        console.error('Error getting API consumption for the specified user from the database: ', error);
        throw error;
    }
}

module.exports = {
    apiConsumptionController
}