// This middleware will be executed before accessing a controller method
// It will check the existance and validity of the token

const jwt = require('jsonwebtoken');
const debug = require('debug')('security:JWToken');
const { seekToken, checkDisabledToken } = require('../services/seekAuth');
const ApiError = require('../errors/apiError');

const { JWTOKEN_KEY } = process.env;

exports.checkJWT = async (req, res, next) => {
    // Get the token from the request header
    const token = seekToken(req);

    // If the token exist we check it
    if (token) {
        return jwt.verify(token, JWTOKEN_KEY, async (err, decoded) => {
            // If the token is expired or altered
            if (err) {
                return next(new ApiError('token_not_valid', { statusCode: 401 }));
            }
            // If verification is ok, the token is decoded
            debug('decoded = ', decoded);
            // Check in redis DB if the decoded token is in the disabled token list (updated when a user logout)
            const disabledToken = await checkDisabledToken(decoded);

            if (disabledToken) {
                return next(new ApiError('Token has been disabled', { statusCode: 401 }));
            }
            // We store the decoded token in the request object to be able to use it in the next middleware
            req.decoded = decoded;
            // Creation of a new token
            const expiresIn = 24 * 60 * 60;
            const newToken = jwt.sign({ user: decoded.cleanedUser }, JWTOKEN_KEY, {
                expiresIn,
            });
            // Add the token to the response header
            res.header('Authorization', `Bearer ${newToken}`);

            return next();
        });
    }
    // If the token is not inside the request header
    return next(new ApiError('token_required', { statusCode: 401 }));
};
