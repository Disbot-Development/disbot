const Event = require('../../Core/Structures/Event');

module.exports = class ProcessExitEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'exit',
            process: true
        });
    };

    /**
     * 
     * @param {Number} code 
     */

    run (code) {
        this.client.logger.error(`Process exit with code ${`${code}`.red}`);
    };
};
