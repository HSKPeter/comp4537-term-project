const { registerUser } = require("../utils/userAuthenticationUtils")

function userRegistrationController(req, res) {
    try {
        const { email, password } = req.body;
        if (email === undefined || password === undefined) {
            res.status(400).json({ error: "missing email or password" });
            return;
        }

        registerUser({ email, password })
            .then((hasRegisteredUser) => {
                if (hasRegisteredUser) {
                    res.status(201).json({ message: "User registered successfully" });
                } else {
                    res.status(400).json({ error: "failed to register user" });
                }
            })
            .catch((err) => {
                console.error(err);
                res.status(500).json({ error: "failed to register user" });
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to register user" });
    }
}

module.exports = {
    userRegistrationController
}