const Bot = require('../../Managers/Bot');

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