const debug = require('debug')('ApiError');

module.exports = class ApiError extends Error {
    constructor(message, infos) {
        // super references the native JS Error Class
        debug(infos);
        super(message);
        this.infos = infos;
    }
};
