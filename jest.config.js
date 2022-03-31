const { defaults } = require('jest-config'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
    moduleFileExtensions: [...defaults.moduleFileExtensions, 'd.ts'],
    verbose: true,
};
