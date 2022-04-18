const debug = require('debug')('tokensManager');
const { createClient } = require('redis');
const jwt = require('jsonwebtoken');
const ApiError = require('../errors/apiError');

const redis = createClient();
const expiresIn = 24 * 60 * 60;
const PREFIX = 'disabledToken';
const { JWTOKEN_KEY } = process.env;

const tokensManager = {
    createToken: (user) => {
        // On crée/signe le token avec toutes nos infos et la clé secrète,
        const newToken = jwt.sign({ user }, JWTOKEN_KEY, { expiresIn });
        return newToken;
    },
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
            const token = tokensManager.seekToken(req);
            await redis.connect();
            await redis.setEx(key, expiresIn, token);
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
module.exports = tokensManager;
