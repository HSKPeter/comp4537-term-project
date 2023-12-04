const swaggerJsdoc = require("swagger-jsdoc");
const YAML = require('yamljs');
const path = require('path');
const { BACKEND_ORIGIN } = require('../config');
const { API_ROUTE_PATHS } = require('./routes');

const swaggerYamlFilename = 'swagger.yaml';
const routerFilePath = "./index.js";

const swaggerYamlFilePath = path.join(__dirname, swaggerYamlFilename);
const swaggerDefinition = YAML.load(swaggerYamlFilePath);
swaggerDefinition.servers = [{ url: BACKEND_ORIGIN + API_ROUTE_PATHS.ROOT }]

const options = {
    swaggerDefinition,
    apis: [routerFilePath],
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = {
    swaggerSpecs
}