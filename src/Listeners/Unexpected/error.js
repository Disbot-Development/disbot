const Event = require('../../Core/Structures/Event');

module.exports = class ErrorEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'error'
        });
    };

    /**
     * 
     * @param {Error} error 
     */

    run (error) {
        this.client.logger.error(`Client Error: ${`${error.stack ? error.stack : error.message}`.red}\n`);
    };
};