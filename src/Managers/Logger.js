const Config = require('./Config');

module.exports = class Logger {
    
    config = new Config();
    name = this.config.username;

    date = new Date(Date.now()).toLocaleTimeString('fr-FR');
    stringDate = `[${this.date}]`;
    stringName = `[${this.name}]`;

    /**
     * 
     * @param {string} message
     * @returns {true}
     */

    loading(message) {
        console.log(`${this.stringDate.grey} ${this.stringName.grey} ${message}`);

        return true;
    };

    /**
     * 
     * @param {string} message
     * @returns {true}
     */

    success(message) {
        console.log(`${this.stringDate.grey} ${this.stringName.green} ${message}`);

        return true;
    };

    /**
     * 
     * @param {String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError} message
     * @returns {true}
     */

    error(message) {
        if (typeof message !== 'string') message = require('util').inspect(message, { depth: 0 });

        console.log(`${this.stringDate.grey} ${this.stringName.red} ${message}`);

        return true;
    };
    
    /**
     * 
     * @param {String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError} message
     * @throws
     */

    throw(message) {
        if (typeof message !== 'string') message = require('util').inspect(message, { depth: 0 });

        throw new Error(`${this.stringDate.grey} ${this.stringName.red} ${message}`);
    };
};