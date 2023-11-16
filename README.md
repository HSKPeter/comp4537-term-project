# COMP 4537 Term Project


## Development Guide

### Start backend
**Pre-requisite: Node v18 must be used to run the backend server, otherwise the server would run into errors when summarizing text with the local machine learning model.**

1. Go to the `backend-api` folder with `cd services/backend-api/`
2. Run `npm install` to install all dependencies
3. Run `npm start` to start the backend server on port 8080
4. Hit `http://localhost:8080/test-ml` to test if the machine learning model is working properly (it would take up around 1GB of memory to run the model)