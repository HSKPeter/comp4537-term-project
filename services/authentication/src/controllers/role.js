async function roleController(req, res) {
    try {
        const { token } = req.body;
        const payload = decodeToken(token);
        if (!payload) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        const { role } = payload;
        const newToken = renewToken(payload);
        res.status(200).json({ role, newToken });
    } catch (error) {
        console.error('Error retrieving role: ', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

function decodeToken(token) {
    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        return decodedToken;
    } catch (error) {
        return null;
    }
}

function renewToken(payload) {
    const { iat, exp, expiresIn, ...corePayload } = payload;
    const newToken = jwt.sign(corePayload, SECRET_KEY, { expiresIn: DEFAULT_TOKEN_EXPIRES_IN });
    return newToken;
}

module.exports = {
    roleController
}
