const debug = require('debug')('cache');
const { rdClient } = require('../db/redisClient');

// Time To Live : 60 * 30 = 30min (60 secondes x 30 = 30 min)
const TTL = 60 * 30;
const PREFIX = 'starrynight:';

// Storage of all the keys inserted in redis
const keys = {
    disconnectKeys: {
        constellation: [],
        myth: [],
    },
    connectKeys: {
        user: [],
        constellation: [],
        event: [],
        place: [],
    },
};

const cache = {
    prepare(req) {
        const infos = {};
        const regex = /^\/v1\/api\/(?:([a-z-]+))\//im;
        // eslint-disable-next-line prefer-destructuring
        infos.entity = req.originalUrl.match(regex)[1];
        if (req.decoded) {
            infos.key = `${PREFIX}${req.decoded.user.id}/${infos.entity}${req.url}`;
            infos.log = 'connectKeys';
        } else {
            infos.key = `${PREFIX}/${infos.entity}${req.url}`;
            infos.log = 'disconnectKeys';
        }
        debug(`entity = ${infos.entity}`);
        debug(`req.url = ${req.url}`);
        debug(`infos.key = ${infos.key}`);
        debug(`KEYS = ${keys[infos.log][infos.entity]}`);
        return infos;
    },

    async fillCache(req, res, next) {
        const infos = cache.prepare(req);
        // If the key is already inside the redis cache
        if (keys[infos.log][infos.entity].includes(infos.key)) {
            debug('GET Cache Data via Redis');
            // We get back the data in JSON string
            const cachedString = await rdClient.get(infos.key);
            if (cachedString) {
                // We transform it in object JS
                const cachedValue = JSON.parse(cachedString);
                // We send back the data to the front
                return res.json(cachedValue);
            }
            debug('cachedString = ', cachedString);
            const index = keys[infos.log][infos.entity].indexOf(infos.key);
            debug('splice keys[infos.log][infos.entity] = ', keys[infos.log][infos.entity]);
            keys[infos.log][infos.entity].splice(index, 1);
            debug('splice keys[infos.log][infos.entity] = ', keys[infos.log][infos.entity]);
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
            debug('Fill Redis with data using customed res.json called in controller');
            if (!data.statusCode) {
                const jsonData = JSON.stringify(data);
                await rdClient.setEx(infos.key, TTL, jsonData);
                keys[infos.log][infos.entity].push(infos.key);
            }
            originalJson(data);
        };
        return next();
    },

    async flushCache(req, _, next) {
        const infos = cache.prepare(req);
        debug(`Flush Data Redis`);
        const promises = [];
        if (infos.log === 'connectKeys') {
            const regex = new RegExp(`^${PREFIX}${req.decoded.user.id}/${infos.entity}/`, 'mi');
            keys[infos.log][infos.entity] = keys[infos.log][infos.entity].filter((key) => {
                debug(`key = ${key}`);
                if (key.match(regex)) {
                    debug(`MATCH`);
                    promises.push(rdClient.del(key));
                    return false;
                }
                return true;
            });
            debug(`Leftover : KEYS = ${keys[infos.log][infos.entity]}`);
        } else {
            keys[infos.log][infos.entity].forEach((key) => promises.push(rdClient.del(key)));
            // We empty the array
            keys[infos.log][infos.entity].length = 0;
        }
        await Promise.all(promises);
        // We empty the array
        next();
    },
};

module.exports = cache;
