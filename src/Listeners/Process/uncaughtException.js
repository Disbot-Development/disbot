const Event = require('../../Core/Structures/Event');

module.exports = class ProcessUncaughtException extends Event {
    constructor(client) {
        super(client, {
            name: 'uncaughtException',
            process: true
        });
    };

    /**
     * 
     * @param {Error} error 
     */

    run (error) {
        this.client.logger.error(`Uncaught Exception: ${`${error.stack ? error.stack : error.message}`.red}\n`);
    };
};