const client = require('../../../index');

module.exports = class Base {

    /**
     * The Base constructor.
     * @param {client} client The client
     * @constructor
     */

    constructor(client) {
        this.client = client;
    };

    run() {};
};