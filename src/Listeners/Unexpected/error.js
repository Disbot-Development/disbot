const Event = require('../../Managers/Structures/Event');

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
        this.client.logger.error(`Error: ${`${error}`.red}\n`);
    };
};