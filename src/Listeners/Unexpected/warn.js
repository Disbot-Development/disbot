const Event = require('../../Managers/Structures/Event');

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
        this.client.logger.error(`Client warning: ${`${error}`.red}\n`);
    };
};