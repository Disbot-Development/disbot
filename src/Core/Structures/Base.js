const Bot = require('../Bot');

module.exports = class Base {

    /**
     * 
     * @param {Bot} client
     * @constructor
     */

    constructor(client) {
        this.client = client;
    };

    run() {};
};