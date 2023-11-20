const swaggerJsdoc = require("swagger-jsdoc");
const YAML = require('yamljs');
const path = require('path');

const swaggerYamlFilePath = path.join(__dirname, 'swagger.yaml');
const swaggerDefinition = YAML.load(swaggerYamlFilePath);
swaggerDefinition.servers = [{ url: "http://localhost:8000" }]; // TODO: Update url

const options = {
    swaggerDefinition,
    apis: [],
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = {
    swaggerSpecs
}