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


    run (guild) {
        this.client.removeData(guild.id);
    };
};