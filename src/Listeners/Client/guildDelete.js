const Event = require('../../Managers/Structures/Event');
const { Guild } = require('discord.js');

module.exports = class GuildDeleteEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'guildDelete'
        });
    };

    /**
     * 
     * @param {Guild} guild
     */


    async run (guild) {
        await this.client.database.delete(guild.id);
    };
};