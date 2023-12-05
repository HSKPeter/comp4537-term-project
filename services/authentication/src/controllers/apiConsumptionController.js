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

module.exports = {
    apiConsumptionController
}