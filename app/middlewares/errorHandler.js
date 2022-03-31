const debug = require('debug')('errorHandler');
// On rentre dans le handler seulement si on a Throw une erreur avant, ainsi on passe le code et le message
const errorHandler = (err, res) => {
    debug('dans handler');
    // Dans erreur il y a plusieurs props dont "message" qui est une prop native de la class Error et
    // "statusCode" qui est une propriété custom que l'on a étendu avec apiError à la class Error
    let { message } = err;
    // SI il y a un statusCode dans err.infos alors on le met dans une variable
    let statusCode = err.infos?.statusCode;

    // SI on a pas défini d'erreur on met 500 par défaut
    if (!statusCode || Number.isNaN(Number(statusCode))) {
        statusCode = 500;
    }

    if (statusCode === 500) {
        // logger.error(err);
    }

    // Si l'application n'est pas en développement on reste vague sur l'erreur serveur
    if (statusCode === 500 && res.app.get('env') !== 'development') {
        message = 'Internal Server Error';
    }

    // Pour récupérer cette info, il faut au début du routeur passer un middleware avec une info :
    // router.use((_, res, next) => { res.type('html'); next(); });
    // Sinon res.get('content-type') est undefined
    if (res.get('content-type').includes('html')) {
        if (res.get('content-type').includes('html')) {
            res.status(statusCode).render('error', {
                statusCode,
                message,
                title: `Error ${err.statusCode}`,
            });
        }
    } else {
        res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
    }
};

module.exports = errorHandler;
