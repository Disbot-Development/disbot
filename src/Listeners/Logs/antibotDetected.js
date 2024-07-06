const Event = require('../../Managers/Structures/Event');
const { Guild, GuildMember } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class AntiBotDetectedEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'antibotDetected'
        });
    };

    /**
     * 
     * @param {Guild} guild
     * @param {GuildMember} member
     * @param {Boolean} kicked
     */
    
    async run (guild, member, kicked) {
        const modules = await this.client.database.get(`${guild.id}.modules`) || [];

        if (modules.includes('logs') && guild.channels.resolve(await this.client.database.get(`${guild.id}.logs.channel`))) {
            guild.channels.resolve(await this.client.database.get(`${guild.id}.logs.channel`)).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-bot')
                    .setDescription(
                        `Un bot Discord a été exclu car il a été détecté par l'anti-bot.\n` +
                        `> **Robot:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}\n` +
                        `> **Exclu:** ${kicked ? `A été exclu ${this.client.config.emojis.yes}` : `N'a pas pu être exclu ${this.client.config.emojis.no}`}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};