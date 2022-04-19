const debug = require('debug')('cache');
const { rdClient } = require('../db/redisClient');

// Time To Live : 30min (60 secondes x 30 = 30 min)
const TTL = 60 * 30;
const PREFIX = 'starrynight:';

// Storage of all the keys inserted in redis
const keys = [];

const cache = {
    async fillCache(req, res, next) {
        debug('req.url = ', req.url);
        const key = `${PREFIX}/myth/${req.url}`;
        // key will have for value for example : starrynight:/v1/api/constellation/names
        // If the key is already inside the redis cache
        if (keys.includes(key)) {
            debug('GET Cache Data via Redis');
            // We get back the data in JSON string
            const cachedString = await rdClient.get(key);
            // We transform it in object JS
            const cachedValue = JSON.parse(cachedString);
            // We send back the data to the front
            return res.json(cachedValue);
        }
        // If the key is not inside the redis cache, then we'll need to put it inside with the data.
        // For that I need the datas from postgres, that will be send back after this middleware
        // to the front by the controller with res.json(data). It means right now I don't have the datas yet.
        // First we save the original code of res.json that we "bind" to the res : we need to explicitely
        // give a value to "this" in the duplicate function so we don't loose the context, therefore we use
        // the bind method that takes a parameter object that will be the context "this".
        const originalJson = res.json.bind(res);
        // Now we redefines the method res.json : we put inside the datas caching with the original method.
        // When a controller call res.json it will have the custom version
        res.json = async (data) => {
            debug('SAVE Data via Redis via res.json customifiée appelée dans le controller');
            const jsonData = JSON.stringify(data);
            await rdClient.setEx(key, TTL, jsonData);
            keys.push(key);
            originalJson(data);
        };
        return next();
    },
    async flushCache(_, __, next) {
        // Delete all
        debug('Flush Data Redis : Delete all');
        const promises = [];
        keys.forEach((key) => promises.push(rdClient.del(key)));
        await Promise.all(promises);
        // We empty the array
        keys.length = 0;
        next();
    },
};

module.exports = cache;
