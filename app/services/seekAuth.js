const debug = require('debug')('seekAuth');
const { createClient } = require('redis');

const redis = createClient();
const blackListArray = [];
const TTL = 24 * 60 * 60;

const seekAuth = {
    // async connect() {
    //     await redis.connect();
    // },
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
    // eslint-disable-next-line consistent-return
    logoutToken: async (decoded) => {
        const key = `logoutToken${decoded.iat}`;
        debug(blackListArray);
        if (blackListArray.includes(key)) {
            debug(blackListArray[key]);
            await redis.connect();
            const logoutToken = await redis.get(`logoutToken${decoded.iat}`);
            await redis.quit();
            return { message: 'user already logged out', unvalidToken: logoutToken };
        }
    },
};
module.exports = seekAuth;
