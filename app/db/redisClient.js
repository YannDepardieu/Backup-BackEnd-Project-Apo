const debug = require('debug')('RedisCache');
const { createClient } = require('redis');

const rdClient = createClient();

const connect = async () => {
    await rdClient.connect();
    debug('RedisClient connected');
};

module.exports = {
    connect,
    rdClient,
};
