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
};

module.exports = {
    apiStatsController
}