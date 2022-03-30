/**
 * @typedef {object} WebsiteError
 * @property {string} status - Status
 * @property {number} statusCode - HTTP Status code
 * @property {string} message - Error message
 */
module.exports = class BackofficeError extends Error {
    constructor(message, infos) {
        super(message);
        this.infos = infos;
    }
};
