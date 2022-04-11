const debug = require('debug')('seekAuth');
const { createClient } = require('redis');

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
    blackList: async (key, token) => {
        await redis.connect();
        await redis.setEx(key, TTL, token);
        await redis.quit();
        blackListArray.push(key);
        debug('blacklist ', blackListArray);
    },
    logoutToken: async (decoded) => {
        await redis.connect();
        const key = `logoutToken${decoded.iat}`;
        // debug('Blacklist: ', blackListArray);
        const timeToLive = await redis.ttl(key);
        debug('Token life in hr: ', Math.round((timeToLive / 60 / 60) * 100) / 100);
        if (blackListArray.includes(key)) {
            debug('logoutToken ', blackListArray[key]);
            const logoutToken = await redis.get(key);
            debug(decoded.exp, timeToLive);
            return { message: 'user already logged out', unvalidToken: logoutToken };
        }
        await redis.quit();
        return null;
    },
};
module.exports = seekAuth;
