const debug = require('debug')('seekAuth');
const { createClient } = require('redis');
const ApiError = require('../errors/apiError');

const redis = createClient();
const TTL = 24 * 60 * 60;

const PREFIX = 'logoutToken';

const seekAuth = {
    seekToken: (req) => {
        let token = req.headers['x-access-token'] || req.headers.authorization;
        if (!!token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        return token;
    },
    disableToken: async (req) => {
        try {
            const key = `${PREFIX}${req.decoded.iat}`;
            const token = seekAuth.seekToken(req);
            await redis.connect();
            await redis.setEx(key, TTL, token);
            await redis.quit();
        } catch (error) {
            debug(error);
        }
    },
    checkDisabledToken: async (decoded, token) => {
        try {
            await redis.connect();
            const key = `${PREFIX}${decoded.iat}`;
            // const timeToLive = await redis.ttl(key);
            // debug('Token life in hr: ', Math.round((timeToLive / 60 / 60) * 100) / 100);
            const disabledToken = await redis.get(key);
            await redis.quit();
            if (disabledToken === token) {
                // debug(decoded.exp, timeToLive);
                return true;
            }
            return null;
        } catch (error) {
            debug(error);
            return new ApiError(error.details[0].message, { statusCode: 400 });
        }
    },
};
module.exports = seekAuth;
