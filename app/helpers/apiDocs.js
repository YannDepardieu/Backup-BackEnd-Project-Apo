const expressJSDocSwagger = require('express-jsdoc-swagger');

const options = {
    info: {
        version: '1.0.0',
        title: "O'blog",
        description: "Blog de l'école O'clock",
    },
    baseDir: __dirname,
    // Indicate which files are analysed in the project by swagger
    filesPattern: ['../routers/**/*.js', '../errors/*.js', '../models/*.js'],
    // URL where the doc page will be available
    swaggerUIPath: process.env.API_DOCUMENTATION_ROUTE,
    // Activation of the documentation through an API route
    exposeApiDocs: true,
    apiDocsPath: '/api/docs',
};

/**
 * Swagger middleware factory
 * @param {object} app Express application
 * @returns {object} Express JSDoc Swagger middleware that create web documentation
 */
module.exports = (app) => expressJSDocSwagger(app)(options);
