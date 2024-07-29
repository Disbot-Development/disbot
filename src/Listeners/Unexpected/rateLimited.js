const Event = require('../../Managers/Structures/Event');
const { RateLimitData } = require('discord.js');

module.exports = class RateLimitedEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'rateLimited'
        });
    };

    /**
     * 
     * @param {RateLimitData} data 
     */

    run (data) {
        this.client.logger.error(`Rate limited for: ${`${Math.floor(data.retryAfter / 1000 / 60)} minute${Math.floor(data.retryAfter / 1000 / 60) > 1 ? 's' : ''}`.red}\n`);
    };
};