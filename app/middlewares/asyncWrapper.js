/**
 * Controller wrapper to manage errors
 * @param {object} controllerMethod a controller to execute inside a try… catch… block
 * @return {object} a controller as middleware function
 */
module.exports = (controllerMethod) => async (req, res, next) => {
    try {
        await controllerMethod(req, res, next);
    } catch (error) {
        next(error);
    }
};
