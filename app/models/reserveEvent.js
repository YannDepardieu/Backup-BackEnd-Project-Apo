const debug = require('debug')('Model:reserveEvent');
const CoreModel = require('./coreModel');
const client = require('../db/postgres');
// const ApiError = require('../errors/apiError');

class ReserveEvent extends CoreModel {
    event_id;

    user_id;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'reserve_event';

    static routeName = 'reserve_event';

    constructor(obj) {
        super(obj);
        this.event_id = obj.event_id;
        this.user_id = obj.user_id;
    }

    static async selectAll(userId) {
        const result = await client.query(`SELECT * from "${this.tableName}"`);
        // sinon, on va fabriquer un tableau de class
        const resultAsClasses = [];
        result.rows.forEach((obj) => {
            // j'appelle mon constructeur, et je stocke l'instance fabriquée dans un tableau
            // Je crée une nouvelle instance de classe mais pas avec new this.constructor(obj) car this est déja
            // notre classe, car on est dans une méthode statique. donc on va faire new this(obj)
            // ce qui sera évalué en new Tag(obj) par exemple
            // console.log('this = ', this.#id)
            const newObj = new this(obj);
            //! Ici on PAS accès à l'id quand on affiche newObj car c'est une prop privée mais il est bien dedans
            // console.log('newObj = ', newObj);
            //! Ici on a accès à l'id uniquement en l'appelant, on passe dans le GETTER
            // console.log('newObj.id = ', newObj.id);
            resultAsClasses.push(newObj);
        });
        return resultAsClasses;
    }
}

module.exports = ReserveEvent;
