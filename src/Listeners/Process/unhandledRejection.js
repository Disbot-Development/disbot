const Event = require('../../Core/Structures/Event');

module.exports = class ProcessUnhandledRejection extends Event {
    constructor(client) {
        super(client, {
            name: 'unhandledRejection',
            process: true
        });
    };

    /**
     * 
     * @param {Error} error 
     */

    run (error) {
        this.client.logger.error(`Unhandled Rejection: ${`${error.stack ? error.stack : error.message}`.red}\n`);
    };
};