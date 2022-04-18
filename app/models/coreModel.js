// eslint-disable-next-line no-unused-vars
const debug = require('debug')('CoreModel');
const bcrypt = require('bcryptjs');
const client = require('../db/postgres');
const ApiError = require('../errors/apiError');

class CoreModel {
    // id est une propriété privée. On ne veut pas que les enfants puissent le modifier. On passera obligatoirement
    // un setter pour la modifier ou en créer une nouvelle instance. On passera par un getter pour récupérer sa valeur
    // Le # est lié au keyword 'set' et 'get'
    #id;

    //! Le constructeur appelle le setter (set) pour modifier la prop privée id
    constructor(obj) {
        this.#id = obj.id;
    }

    // On passera dans cette méthode lorsque l'on voudra récupérer l'id
    get id() {
        return this.#id; // Dans le getter le # est très important
    }

    // On passera dans cette méthode lorsque l'on voudra modifier l'id ou créer une nouvelle instance
    set id(newValue) {
        // si on a pas encore d'id, on autorise de le changer UNE FOIS
        // Dans le setter le # est très important
        if (this.#id !== undefined) {
            throw Error('Do not try to change id'); // si y'a déja un id, interdiction d'y toucher
        }
        this.#id = newValue; // je sauvegarde mon id
    }

    static async selectAll() {
        // Dans une méthode static this fait référence notre classe (Tag, Article)
        // donc this.tableName permet d'accéder a la propriété statique
        const result = await client.query(`SELECT * FROM "${this.tableName}"`);
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

    static async selectByPk(id) {
        debug('id = ', id);
        const SQL = {
            text: `SELECT * FROM "${this.tableName}" WHERE id=$1`,
            values: [id],
        };
        const result = await client.query(SQL);

        if (result.rows.length === 0) {
            throw new ApiError(`${this.tableName} not found for this id`, {
                statusCode: 404,
            });
        }
        const obj = new this(result.rows[0]);
        return obj;
    }

    static async selectOne(input) {
        if (input.password) {
            // eslint-disable-next-line no-param-reassign
            delete input.password;
        }
        const fields = Object.keys(input).map((prop, index) => `"${prop}" = $${index + 1}`);
        const values = Object.values(input);
        const SQL = {
            text: `SELECT * FROM "${this.tableName}" WHERE (${fields.join(' AND ')})`,
            values: [...values],
        };
        // const SQL = {
        //     text: `SELECT * FROM "${this.tableName}" WHERE ${Object.keys(input)[0]} = $1`,
        //     values: [Object.values(input)[0]],
        // };
        const result = await client.query(SQL);
        debug(result.rows);
        if (result.rows.length === 0) {
            throw new ApiError(`${this.tableName} not found for this data`, {
                statusCode: 404,
            });
        }

        return new this(result.rows[0]);
    }

    static async insert(input) {
        if (input.password) {
            // eslint-disable-next-line no-param-reassign
            input.password = bcrypt.hashSync(input.password, 10);
        }
        const props = Object.keys(input).map((prop) => `"${prop}"`);
        const fields = Object.keys(input).map((_, index) => `$${index + 1}`);
        const values = Object.values(input);
        const SQL = {
            text: `INSERT INTO "${this.tableName}" (${props})
            VALUES (${fields}) RETURNING *`,
            values: [...values],
        };
        const inserted = await client.query(SQL);
        return new this(inserted.rows[0]);
    }

    static async update(id, input) {
        const fields = Object.keys(input).map((prop, index) => `"${prop}" = $${index + 1}`);
        const values = Object.values(input);

        const result = await client.query(
            `
                UPDATE "${this.tableName}" SET ${fields}
                WHERE id = $${fields.length + 1} RETURNING *
            `,
            [...values, id],
        );

        return result.rows[0];
    }

    static async isUnique(inputData, id) {
        let uniquesConstraints = await client.query(`
            SELECT con.conname
            FROM pg_catalog.pg_constraint con
            INNER JOIN pg_catalog.pg_class rel
            ON rel.oid = con.conrelid
            WHERE rel.relname = '${this.tableName}' AND contype = 'u';
        `);
        const columnRegex = new RegExp(`^${this.tableName}_(?:([a-z_]+))_key$`, 'mi');
        const column = [];
        uniquesConstraints = uniquesConstraints.rows;
        uniquesConstraints.forEach((constraint) => {
            if (constraint.conname.match(columnRegex)) {
                column.push(constraint.conname.match(columnRegex)[1]);
            }
        });
        const fields = [];
        const values = [];
        let index = 1;
        // On récupère la liste des infos envoyés
        Object.entries(inputData).forEach(([key, value]) => {
            // On ne garde que les infos qui sont censées être unique
            if (column.includes(key)) {
                // On génère le filtre avec ces infos
                fields.push(`"${key}" = $${index}`);
                values.push(value);
                index += 1;
            }
        });
        if (fields.length === 0) {
            return null;
        }
        const preparedQuery = {
            text: `SELECT * FROM "${this.tableName}" WHERE (${fields.join(' OR ')})`,
            values,
        };
        // Si l'id est fourni on exclu l'enregistrement qui lui correspond
        if (id) {
            preparedQuery.text += ` AND id <> $${values.length + 1}`;
            preparedQuery.values.push(id);
        }
        const result = await client.query(preparedQuery);

        if (result.rowCount > 0) {
            throw new ApiError(`This ${this.tableName} new entry is not unique`, {
                statusCode: 400,
            });
        }

        return `This ${this.tableName} is unique`;
    }

    static async delete(id) {
        const query = {
            text: `DELETE FROM "${this.tableName}" WHERE id=$1`,
            values: [id],
        };
        const result = await client.query(query);
        if (result.rowCount === 0) {
            return null;
        }
        return { delete: true };
    }
}

module.exports = CoreModel;
