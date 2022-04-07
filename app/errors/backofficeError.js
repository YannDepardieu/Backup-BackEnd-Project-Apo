module.exports = class BackofficeError extends Error {
    constructor(message, infos) {
        super(message);
        this.infos = infos;
    }
};
