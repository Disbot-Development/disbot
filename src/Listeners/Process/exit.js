const Event = require('../../Managers/Structures/Event');

module.exports = class ProcessExitEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'exit'
        });
    };

    /**
     * 
     * @param {number} code 
     */

    run (code) {
        this.client.logger.error(`Process exit with code ${`${code}`.red}`);
    };
};
