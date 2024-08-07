const Event = require('../../Managers/Structures/Event');

module.exports = class ProcessUnhandledRejection extends Event {
    constructor(client) {
        super(client, {
            name: 'unhandledRejection'
        });
    };

    /**
     * 
     * @param {Error} error 
     */

    run (error) {
        this.client.logger.error(`Unhandled Rejection: ${`${error}`.red}\n`);
    };
};