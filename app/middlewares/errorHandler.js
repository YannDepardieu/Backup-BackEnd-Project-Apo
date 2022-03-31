const debug = require('debug')('errorHandler');

/**
 * Middleware that respond to a next method with an error as argument
 * We go into this function only if an error is thrown before, the code error and the error message are passed
 * to the function and that returns a custom response depending on the error type
 * @param {object} err Error class
 * @param {object} res Express response object
 */
const errorHandler = (err, res) => {
    debug('dans handler');
    // In the "err" object there are different proprieties like "message" which is native to the Error Class
    // and "statusCode" which is a custom propriety added in the custom ApiError and BackofficeError extended
    // from the Error native Class
    let { message } = err;
    // If there is a propriety statusCode in err.infos then it is stocked into a variable of the same name
    let statusCode = err.infos?.statusCode;

    // If there is no statusCode, a default one 500 is attributed
    if (!statusCode || Number.isNaN(Number(statusCode))) {
        statusCode = 500;
    }

    if (statusCode === 500) {
        // logger.error(err);
    }

    // If the app is not in developpement (so in production) the response error message will be generic so we don't
    // send to much info to the user
    if (statusCode === 500 && res.app.get('env') !== 'development') {
        message = 'Internal Server Error';
    }

    // To get back the content-type response, two middlewares are placed on both routers to define it depending
    // if it is the api (so json) or the backoffice (html) that response to the client
    // Without those middlewares, res.get('content-type') stays undefined
    if (res.get('content-type').includes('html')) {
        if (res.get('content-type').includes('html')) {
            res.status(statusCode).render('error', {
                statusCode,
                message,
                title: `Error ${err.statusCode}`,
            });
        }
    } else {
        res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
    }
};

module.exports = errorHandler;
