const expressJSDocSwagger = require('express-jsdoc-swagger');
require('dotenv').config();

const options = {
    info: {
        version: '1.0.0',
        title: 'Starry Nights',
        description: 'API pour le ciel nocturne',
    },
    baseDir: __dirname,
    // Indicate which files are analysed in the project by swagger
    filesPattern: [
        '../routers/**/*.js',
        '../errors/*.js',
        '../controllers/**/*.js',
        '../models/*.js',
    ],
    // URL where the doc page will be available
    swaggerUIPath: process.env.API_DOCUMENTATION_ROUTE,
    // Activation of the documentation through an API route
    exposeApiDocs: true,
    apiDocsPath: `/${process.env.API_DOCUMENTATION_ROUTE}`,
};

/**
 * Swagger middleware factory
 * @param {object} app Express application
 * @returns {object} Express JSDoc Swagger middleware that create web documentation
 */
module.exports = (app) => expressJSDocSwagger(app)(options);
