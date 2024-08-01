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
        const logsId = await this.client.database.get(`${guild.id}.logs.channel`);
        const logs = logsId ? await guild.channels.fetch(logsId).catch(() => undefined) : undefined;

        if (modules.includes('logs') && logs) {
            logs.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-spam')
                    .setDescription(
                        `Un utilisateur vient d\'être rendu muet car il a été détecté par le système d'anti-spam.\n` +
                        `> **Utilisateur:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}\n` +
                        `> **Limite de messages en ${this.client.config.antispam.cooldown} seconde${this.client.config.antispam.cooldown > 1 ? 's' : ''}:** ${limit} message${limit > 1 ? 's' : ''}\n` +
                        `> **Durée rendu muet:** ${duration} minute${duration > 1 ? 's' : ''}\n` +
                        `> **Fin:** <t:${Math.round((Date.now() + duration * 1000 * 60) / 1000)}:D> à <t:${Math.round((Date.now() + duration * 1000 * 60) / 1000)}:T> (<t:${Math.round((Date.now() + duration * 1000 * 60) / 1000)}:R>)`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};