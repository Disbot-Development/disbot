const Bot = require('../../Managers/Bot');
const Base = require('./Base');

module.exports = class Event extends Base {

    /**
     * 
     * @typedef {Object} EventConfig
     * @property {String} name
     */

    /**
     * 
     * @param {Bot} client
     * @param {EventConfig} config
     * @constructor
     */

    constructor(client, {
        name = null,
    }) {
        super(client);

        this.config = {
            name
        };
    };
};