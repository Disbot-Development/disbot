const Event = require('../../Core/Structures/Event');

module.exports = class ProcessWarningEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'warning',
            process: true
        });
    };

    /**
     * 
     * @param {String} error 
     */

    run (error) {
        this.client.logger.error(`Warning: ${`${error}`.red}\n`);
    };
};