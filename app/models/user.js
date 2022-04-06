// const debug = require('debug')('Model:User');
const CoreModel = require('./index');
// const client = require('../db/postgres');
// const ApiError = require('../errors/apiError');

class User extends CoreModel {
    firstname;

    lastname;

    email;

    password;

    role;

    notification;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'user';

    static routeName = 'users';

    constructor(obj) {
        super(obj);
        this.firstname = obj.firstname;
        this.lastname = obj.lastname;
        this.email = obj.email;
        this.password = obj.password;
        this.role = obj.role;
        this.notification = obj.notification;
    }
}

module.exports = User;
