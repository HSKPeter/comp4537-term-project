const express = require('express');
// const crypto = require('crypto'); can be used for hashing
const { getHash, getTOken } = require('./utils');


const app = express();
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    // Demo user with hashed password
    const demoUser = {
      username: 'testuser',
      passwordHash: 'password_hash' // Example hash for "password"
    };
  
    // Hash the received password
    const hashedPassword = getHash(password)
  
    // Compare hashed password with stored hash
    if (username === demoUser.username && hashedPassword === demoUser.passwordHash) {
      const token = getToken() // Replace with actual token generation logic
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
  