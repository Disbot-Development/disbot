const Event = require('../../Managers/Structures/Event');
const { RateLimitData } = require('discord.js');

module.exports = class RateLimitEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'rateLimit'
        });
    };

    /**
     * 
     * @param {RateLimitData} data 
     */

    run (data) {
        this.client.logger.error(`Rate limited for: ${`${Math.floor(data.timeout / 1000 / 60)} minute${Math.floor(data.timeout / 1000 / 60) > 1 ? 's' : ''}`.red}\n`);
    };
};