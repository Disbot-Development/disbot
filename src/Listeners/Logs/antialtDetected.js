const { Guild, GuildMember } = require('discord.js');

const MessageEmbed = require('../../Managers/MessageEmbed');
const Event = require('../../Managers/Structures/Event');

module.exports = class AntiAltDetectedEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'antialtDetected'
        });
    };

    /**
     * 
     * @param {Guild} guild
     * @param {GuildMember} member
     * @param {Boolean} kicked
     * @param {Number} age
     */
    
    async run (guild, member, kicked, age) {
        const modules = await this.client.database.get(`${guild.id}.modules`) || [];
        const logsId = await this.client.database.get(`${guild.id}.logs.channel`);
        const logs = logsId ? await guild.channels.fetch(logsId).catch(() => undefined) : undefined;

        if (modules.includes('logs') && logs) {
            logs.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-alt')
                    .setDescription(
                        `Un utilisateur a été exclu car il a été détecté par l'anti-alt.\n` +
                        `> **Utilisateur:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}\n` +
                        `> **Âge minimum:** ${age} heure${age > 1 ? 's' : ''}\n` +
                        `> **Exclu:** ${kicked ? `A été exclu ${this.client.config.emojis.yes}` : `N'a pas pu être exclu ${this.client.config.emojis.no}`}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};