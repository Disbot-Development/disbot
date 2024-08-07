const Event = require('../../Managers/Structures/Event');

module.exports = class ProcessWarningEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'warning'
        });
    };

    /**
     * 
     * @param {string} error 
     */

    run (error) {
        this.client.logger.error(`Warning: ${`${error}`.red}\n`);
    };
};