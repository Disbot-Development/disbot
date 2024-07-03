const client = require('../../index');

module.exports = class Logger {

    /**
     * 
     * @param {client} client
     * @constructor
     */

    constructor(client) {
        this.client = client;
    };
    
    name = 'Disbot';

    /**
     * 
     * @private
     */

    get date() {
        return new Date(Date.now()).toLocaleTimeString('fr-FR');
    };

    /**
     * 
     * @param {string} message
     * @returns {true}
     */

    loading(message) {
        console.log(`${`[${this.date}]`.grey} ${`[${this.name}]`.grey} ${message}`);

        return true;
    };

    /**
     * 
     * @param {string} message
     * @returns {true}
     */

    success(message) {
        console.log(`${`[${this.date}]`.grey} ${`[${this.name}]`.green} ${message}`);

        return true;
    };

    /**
     * 
     * @param {String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError} message
     * @returns {true}
     */

    error(message) {
        if (typeof message !== 'string') message = require('util').inspect(message, { depth: 0 });

        console.log(`${`[${this.date}]`.grey} ${`[${this.name}]`.red} ${message}`);

        return true;
    };
    
    /**
     * 
     * @param {String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError} message
     * @throws
     */

    throw(message) {
        if (typeof message !== 'string') message = require('util').inspect(message, { depth: 0 });

        throw new Error(`${`[${this.date}]`.grey} ${`[${this.name}]`.red} ${message}`);
    };
};