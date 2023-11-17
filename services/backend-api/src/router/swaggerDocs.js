const swaggerJsdoc = require("swagger-jsdoc");
const YAML = require('yamljs');
const path = require('path');
const { BACKEND_ORIGIN } = require('../config');

const swaggerYamlFilePath = path.join(__dirname, 'swagger.yaml');
const swaggerDefinition = YAML.load(swaggerYamlFilePath);
swaggerDefinition.servers = [{ url: BACKEND_ORIGIN }];

const options = {
    swaggerDefinition,
    apis: ["./index.js"],
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = {
    swaggerSpecs
}