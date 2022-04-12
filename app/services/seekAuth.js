const debug = require('debug')('seekAuth');
const { createClient } = require('redis');
const ApiError = require('../errors/apiError');

const redis = createClient();
const blackListArray = [];
const TTL = 24 * 60 * 60;

const seekAuth = {
    seekToken: (req) => {
        let token = req.headers['x-access-token'] || req.headers.authorization;
        if (!!token && token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }
        // debug('token = ', token);
        return token;
    },
    disableToken: async (key, token) => {
        try {
            await redis.connect();
            await redis.setEx(key, TTL, token);
            await redis.quit();
            blackListArray.push(key);
            debug('blacklist ', blackListArray);
        } catch (error) {
            debug(error);
        }
    },
    checkDisabledToken: async (decoded) => {
        try {
            await redis.connect();
            const key = `logoutToken${decoded.iat}`;
            // debug('Blacklist: ', blackListArray);
            const timeToLive = await redis.ttl(key);
            debug('Token life in hr: ', Math.round((timeToLive / 60 / 60) * 100) / 100);
            if (blackListArray.includes(key)) {
                debug('logoutToken ', blackListArray[key]);
                const logoutToken = await redis.get(key);
                debug(decoded.exp, timeToLive);
                await redis.quit();
                return { message: 'user already logged out', unvalidToken: logoutToken };
            }
            await redis.quit();
            return null;
        } catch (error) {
            debug(error);
            return new ApiError(error.details[0].message, { statusCode: 400 });
        }
    },
};
module.exports = seekAuth;
