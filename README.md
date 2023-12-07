# COMP 4537 Term Project

## Development Guide

### React Frontend
1. Run `cd services/frontend`
2. Run `npm install`
3. Run `npm start`to start the react app
4. Open browser and visit `http://localhost:3000` to see the app
### Express Backend API
1. Run `cd services/backend-api` to change directory to the backend-api
2. Run `cp .env.example .env` to create a .env file
3. Add your Hugging Face API key to the .env file
4. Run `npm install` to install all dependencies
5. Run `npm run dev` to start the development server
6. Open browser and visit `http://localhost:8080/api-docs` to view the swagger documentation and try out the API

### Express Authentication Service
1. Run `cd services/authentication/src` to change directory to src
2. Create an `.env` file in the current directory with a variable named `JWT_SECRET_KEY` and specify it's value (ex. AMIRacle)
3. Run `npm install` to install all dependencies
4. Run `node server.js` to start the authentication
5. Open browser and visit `http://localhost:8000/api-docs`

### Attribution to Outside Resources
- ChatGPT for code suggestions
- GitHub Copilot for auto code completions

