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
     * @param {Array[String]}
     */
    
    run (guild, member, limit, duration) {
        const modules = guild.getModules();

        if (modules.includes('logs') && guild.channels.resolve(guild.getData('logs.channel'))) {
            guild.channels.resolve(guild.getData('logs.channel')).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-spam')
                    .setDescription(
                        `Un utilisateur vient d\'être exclu car il a été détecté par le système d'anti-spam.\n` +
                        `> **Utilisateur:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}\n` +
                        `> **Limite de messages en ${this.client.config.antispam.timeout} seconde${this.client.config.antispam.timeout > 1 ? 's' : ''}:** ${limit} message${limit > 1 ? 's' : ''}\n` +
                        `> **Durée de l'exclusion:** ${duration} minute${duration > 1 ? 's' : ''}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};