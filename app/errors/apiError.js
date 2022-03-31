/**
 * This a custom homemade error. It is called an "exception". The native error can already take a message.
 * The custom one can take another information : a status code HTTP
 * Instances will carry these informations that will be exploited later
 * @typedef {object} ApiError
 * @property {string} status - Status
 * @property {number} statusCode - HTTP Status code
 * @property {string} message - Error message
 */
module.exports = class ApiError extends Error {
    constructor(message, infos) {
        // super references the native JS Error Class
        super(message);
        this.infos = infos;
    }
};
