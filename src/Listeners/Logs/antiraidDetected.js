const Event = require('../../Managers/Structures/Event');
const { Guild } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class AntiRaidDetectedEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'antiraidDetected'
        });
    };

    /**
     * 
     * @param {Guild} guild
     * @param {Number} limit
     */
    
    async run (guild, limit) {
        const modules = await this.client.database.get(`${guild.id}.modules`) || [];

        if (modules.includes('logs') && guild.channels.resolve(await this.client.database.get(`${guild.id}.logs.channel`))) {
            guild.channels.resolve(await this.client.database.get(`${guild.id}.logs.channel`)).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-raid')
                    .setDescription(
                        `Les invitations ont été mises en pause car un raid a été détecté.\n` +
                        `> **Limite de comptes en ${this.client.config.antiraid.timeout} seconde${this.client.config.antiraid.timeout > 1 ? 's' : ''}:** ${limit} compte${limit > 1 ? 's' : ''}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};