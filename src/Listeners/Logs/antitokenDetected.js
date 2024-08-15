const { Guild, GuildMember } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class AntiTokenDetectedEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'antitokenDetected'
        });
    };

    /**
     * 
     * @param {Guild} guild
     * @param {GuildMember} member
     * @param {Number} duration
     */
    
    async run (guild, member, duration) {
        const modules = await this.client.database.get(`${guild.id}.modules`) || [];
        const logsId = await this.client.database.get(`${guild.id}.logs.channel`);
        const logs = logsId ? await guild.channels.fetch(logsId).catch(() => undefined) : undefined;

        if (modules.includes('logs') && logs) {
            logs.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-token')
                    .setDescription(
                        `Un utilisateur vient d\'être rendu muet car il a été détecté par le système d'anti-token.\n` +
                        `> **Utilisateur:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}\n` +
                        `> **Durée rendu muet:** ${duration} minute${duration > 1 ? 's' : ''}\n` +
                        `> **Fin:** <t:${Math.round((Date.now() + duration * 1000 * 60) / 1000)}:D> à <t:${Math.round((Date.now() + duration * 1000 * 60) / 1000)}:T> (<t:${Math.round((Date.now() + duration * 1000 * 60) / 1000)}:R>)`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};