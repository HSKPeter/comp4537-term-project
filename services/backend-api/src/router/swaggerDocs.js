const swaggerJsdoc = require("swagger-jsdoc");
const YAML = require('yamljs');
const path = require('path');

const swaggerYamlFilePath = path.join(__dirname, 'swagger.yaml');
const swaggerDefinition = YAML.load(swaggerYamlFilePath);

const options = {
    swaggerDefinition,
    apis: ["./index.js"],
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = {
    swaggerSpecs
}