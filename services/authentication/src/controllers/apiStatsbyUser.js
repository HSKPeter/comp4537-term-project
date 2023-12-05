async function apiStatsByUserController(req, res) {
    try {
        // Fetch API stats
        const apiStats = await getApiStatsByUserFromDatabase();

        // Return API stats
        res.status(200).json({ usageStats: apiStats });

    } catch (err) {
        console.error(`Failed to get API stats from the database: ${err?.stack ?? err}`);
        res.status(500).json({ error: 'Failed to fetch API stats from the database' });
    }
}

async function getApiStatsByUserFromDatabase() {
    try {
        const apiStatsByUserQuery = `
            SELECT
                User.Name AS 'username',
                User.Email AS 'email',
                UserType.UserAuthorization AS 'role',
                COUNT(*) AS 'apiConsumption'
            FROM APICall
            JOIN User ON APICall.UserID = User.UserID
            JOIN UserType ON User.UserType = UserType.UserTypeID
            GROUP BY User.Name, User.Email, UserType.UserAuthorization;
        `;

        const apiStatsByUser = await runSQLQuery(apiStatsByUserQuery);

        // Transform the result to the desired format
        const formattedApiStats = apiStatsByUser.map(apiStat => ({
            username: apiStat.username,
            email: apiStat.email,
            role: apiStat.role,
            apiConsumption: apiStat.apiConsumption
        }));

        return formattedApiStats;
    } catch (error) {
        console.error('Error getting API stats by user from the database: ', error);
        throw error;
    }
}


module.exports = {
    apiStatsByUserController
}
