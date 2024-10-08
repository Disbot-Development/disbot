const Event = require('../../Core/Structures/Event');

module.exports = class WarnEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'warn'
        });
    };

    /**
     * 
     * @param {string} error 
     */

    run (error) {
        this.client.logger.error(`Client Warning: ${`${error.stack ? error.stack : error.message}`.red}\n`);
    };
};