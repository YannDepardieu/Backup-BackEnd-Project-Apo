// const { ApiError } = require('../middlewares/errorHandler');
const debug = require('debug')('coreModel');

/**
 * @typedef {object} constellation
 * @property {number} id - Constellation identifier
 * @property {string} name - Constellation french name
 * @property {string} scientific_name - Constellation scientific name
 * @property {string} latin_name - Constellation latin name
 * @property {string} img_name - Constellation image file name
 * @property {string} story - Constellation myth
 */

module.exports = {
    /**
     * Retrieves one random myth by day
     * @return {constellation} one daily random myth
     */
    oneDailyMyth() {
        const result = {
            id: '1',
            name: 'Andromède',
            scientific_name: 'Andromeda',
            latin_name: 'Andromeda',
            img_name: 'and.jpg',
            story: 'Andromède, était la fille de Céphée, le roi éthiopien de Joppé, et de Cassiopée.',
        };
        return result;
    },
    /**
     * Retrieves all constellations myths
     * @return {constellation[]} every constellations on the DB
     */
    findAllConstellations() {
        const result = [
            {
                id: '1',
                name: 'Andromède',
                scientific_name: 'Andromeda',
                latin_name: 'Andromeda',
                img_name: 'and.jpg',
                story: 'Andromède, était la fille de Céphée, le roi éthiopien de Joppé, et de Cassiopée.',
            },
            {
                id: '2',
                name: 'Machine Pneumatique',
                scientific_name: 'Antlia',
                latin_name: 'Antlia',
                img_name: 'Ant',
                story: 'Andromède, était la fille de Céphée, le roi éthiopien de Joppé, et de Cassiopée.',
            },
        ];
        return result;
    },
    /**
     * Retrieves one constellation myth by its ID
     * @return {constellation} one constellation myth
     */
    findConstellationByPk(id) {
        debug(id);
        const result = {
            id: '1',
            name: 'Andromède',
            scientific_name: 'Andromeda',
            latin_name: 'Andromeda',
            img_name: 'and.jpg',
            story: 'Andromède, était la fille de Céphée, le roi éthiopien de Joppé, et de Cassiopée.',
        };
        return result;
    },
};
