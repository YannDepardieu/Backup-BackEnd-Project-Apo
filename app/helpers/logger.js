/**
 * Liste des niveaux de log
 *
 * "fatal" (60):
 *     The service/app is going to stop or
 *     become unusable now. An operator should definitely look into this soon.
 *     "error" (50): Fatal for a particular request,
 *     but the service/app continues servicing other requests.
 *     An operator should look at this soon(ish).
 * "warn" (40):
 *     A note on something that should probably
 *     be looked at by an operator eventually.
 * "info" (30):
 *     Detail on regular operation.
 * "debug" (20):
 *     Anything else, i.e. too verbose to be included in "info" level.
 * "trace" (10):
 *     Logging from external libraries used by
 *     your app or very detailed application logging.
 */
const bunyan = require('bunyan');

const streams = [];

// No errors will be displayed in the terminal while the project is in production
// nb : This part of code cannot be tested with Jest.
if (!process.env.NODE_ENV !== 'production') {
    streams.push({
        level: 'error',
        // Create a display in the terminal
        stream: process.stdout,
    });
} else {
    streams.push({
        level: 'error', // Starting at error level, the logs won't be kept
        path: './log/error.log', // Path to the log file (Don't forget to put it in the .gitignore)
        type: 'rotating-file', // Indicates that there will be a rotation between the files
        // (New file in a definite period + history of the files that are kept)
        period: '1d', // Rotation of the daily log files
        count: 3, // An history of 3 log files is allowed (Donc ici 3 jours)
    });
}

const logger = bunyan.createLogger({
    name: 'base-rest-api',
    streams,
});

module.exports = logger;
