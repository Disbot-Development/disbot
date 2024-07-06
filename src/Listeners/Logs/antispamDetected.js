const Event = require('../../Managers/Structures/Event');
const { Guild, GuildMember } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class AntiSpamDetectedEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'antispamDetected'
        });
    };

    /**
     * 
     * @param {Guild} guild
     * @param {GuildMember} member
     * @param {Number} limit
     * @param {Number} duration
     */
    
    async run (guild, member, limit, duration) {
        const modules = await this.client.database.get(`${guild.id}.modules`) || [];

        if (modules.includes('logs') && guild.channels.resolve(await this.client.database.get(`${guild.id}.logs.channel`))) {
            guild.channels.resolve(await this.client.database.get(`${guild.id}.logs.channel`)).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-spam')
                    .setDescription(
                        `Un utilisateur vient d\'être rendu muet car il a été détecté par le système d'anti-spam.\n` +
                        `> **Utilisateur:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}\n` +
                        `> **Limite de messages en ${this.client.config.antispam.timeout} seconde${this.client.config.antispam.timeout > 1 ? 's' : ''}:** ${limit} message${limit > 1 ? 's' : ''}\n` +
                        `> **Durée rendu muet:** ${duration} minute${duration > 1 ? 's' : ''}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};