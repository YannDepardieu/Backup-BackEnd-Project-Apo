const fetch = require('node-fetch');
const debug = require('debug')('positionStack');
const ApiError = require('../errors/apiError');

const baseUrl = 'http://api.positionstack.com/v1/';

module.exports = {
    async forward(query) {
        const fullUrl = `${baseUrl}forward?access_key=${process.env.KEY}&query=${query.address}`;
        debug(fullUrl);
        const response = await fetch(fullUrl);
        debug('response = ', response);
        // Je teste tous les status 200 de réponses positive
        if (response.ok) {
            const json = await response.json();
            debug('json = ', json);
            const { data } = json;
            if (data.length > 0) {
                return data;
            }
            const message = { text: 'Pas de résultat pour cette adresse' };
            return message;
        }
        throw new ApiError('Problem with external API', { statusCode: 500 });
    },
    async reverse(query) {
        const fullUrl = `${baseUrl}reverse?access_key=${process.env.KEY}&query=${query.gps}`;
        debug(fullUrl);
        const response = await fetch(fullUrl);
        debug('response = ', response);
        // Je teste tous les status 200 de réponses positive
        if (response.ok) {
            const json = await response.json();
            debug('json = ', json);
            const { data } = json;
            if (data.length > 0) {
                return data;
            }
            const message = { text: 'Pas de résultat pour ces coordonnées de latitude longitude' };
            return message;
        }
        throw new ApiError('Problem with external API', { statusCode: 500 });
    },
};
