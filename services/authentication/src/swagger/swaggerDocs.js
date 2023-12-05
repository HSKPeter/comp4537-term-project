const swaggerJsdoc = require("swagger-jsdoc");
const YAML = require('yamljs');
const path = require('path');

const swaggerYamlFilePath = path.join(__dirname, 'swagger.yaml');
const swaggerDefinition = YAML.load(swaggerYamlFilePath);
swaggerDefinition.servers = [{ url: "https://patrickcammayo.com/COMP4537/project/api/v2/authentication" }]; 

const options = {
    swaggerDefinition,
    apis: [],
};

const swaggerSpecs = swaggerJsdoc(options);

module.exports = {
    swaggerSpecs
}