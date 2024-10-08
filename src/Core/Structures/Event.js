const Base = require('./Base');
const Bot = require('../Bot');

module.exports = class Event extends Base {

    /**
     * 
     * @typedef {Object} EventConfig
     * @property {String} name
     * @property {Boolean} process
     * @property {Boolean} rest
     */

    /**
     * 
     * @param {Bot} client
     * @param {EventConfig} config
     * @constructor
     */

    constructor(client, {
        name = null,
        process = false,
        rest = false
    }) {
        super(client);

        this.config = {
            name,
            process,
            rest
        };
    };
};