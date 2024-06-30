const Base = require('./Base');
const client = require('../../../index');

module.exports = class Event extends Base {

    /**
     * The Event config
     * @typedef {object} EventConfig
     * @property {string} name The name
     */

    /**
     * The Event constructor.
     * @param {client} client The client
     * @param {EventConfig} config The config
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