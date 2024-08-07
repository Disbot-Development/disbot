const Event = require('../../Managers/Structures/Event');

module.exports = class ProcessUncaughtException extends Event {
    constructor(client) {
        super(client, {
            name: 'uncaughtException'
        });
    };

    /**
     * 
     * @param {Error} error 
     */

    run (error) {
        this.client.logger.error(`Uncaught Exception: ${`${error}`.red}\n`);
    };
};