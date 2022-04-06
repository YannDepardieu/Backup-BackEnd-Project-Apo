const CoreModel = require('./index');

class Constellation extends CoreModel {
    name;

    latin_name;

    scientific_name;

    img_name;

    story;

    spotting;

    // on surcharge la proprieté statique tableName définie dans le parent CoreModel
    static tableName = 'constellation';

    static routeName = 'constellations';

    constructor(obj) {
        super(obj);
        this.name = obj.name;
        this.latin_name = obj.latin_name;
        this.img_name = obj.img_name;
        this.story = obj.story;
        this.spotting = obj.spotting;
    }
}

module.exports = Constellation;
