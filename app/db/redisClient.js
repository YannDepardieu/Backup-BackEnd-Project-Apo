const debug = require('debug')('Redis');
const { createClient } = require('redis');

const rdClient = createClient();

const connect = async () => {
    await rdClient.connect();
    debug('Client connected');
};

module.exports = {
    connect,
    rdClient,
};
