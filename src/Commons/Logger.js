const Config = require('../Core/Config');

module.exports = class Logger {

    /**
     * 
     * @param {Config} config
     * @constructor
     */

    constructor(config) {
        this.config = config;

        this.date = new Date(Date.now()).toLocaleTimeString('fr-FR');
        this.stringDate = `[${this.date}]`;

        this.name = this.config.username;
        this.stringName = `[${this.name}]`;
    };

    /**
     * 
     * @param {String} message
     * @returns {true}
     */

    loading(message) {
        console.log(`${this.stringDate.grey} ${this.stringName.grey} ${message}`);

        return true;
    };

    /**
     * 
     * @param {String} message
     * @param {Object} [timeOptions]
     * @param {Number} [timeOptions.start]
     * @param {Number} [timeOptions.end]
     * @param {Boolean} [timeOptions.inline]
     */

    success(message, timeOptions) {
        const duration = timeOptions ? (timeOptions.end - timeOptions.start).toFixed(2) : undefined;
        const durationString = `(${duration}ms)`;
        
        console.log(`${this.stringDate.grey} ${this.stringName.green} ${message} ${timeOptions ? durationString.grey : ''} ${timeOptions && timeOptions.inline ? '\n' : ''}`);

        return true;
    };

    /**
     * 
     * @param {String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError} message
     * @returns {true}
     */

    error(message) {
        console.error(`${this.stringDate.grey} ${this.stringName.red} ${message}`);

        return true;
    };

    /**
     * 
     * @param {String|Error|EvalError|RangeError|ReferenceError|SyntaxError|TypeError} message
     * @throws {Error}
     */

    throw(message) {
        throw new Error(`${this.stringDate.grey} ${this.stringName.red} ${message}`);
    };
};