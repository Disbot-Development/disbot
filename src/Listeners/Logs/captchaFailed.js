const { Guild } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class CaptchaFailedEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'captchaFailed'
        });
    };

    /**
     * 
     * @param {Guild} guild
     * @param {GuildMember} member 
     * @param {String} code
     */
    
    async run (guild, member, code) {
        const modules = await this.client.database.get(`${guild.id}.modules`) || [];
        const logsId = await this.client.database.get(`${guild.id}.logs.channel`);
        const logs = logsId ? await guild.channels.fetch(logsId).catch(() => undefined) : undefined;

        if (modules.includes('logs') && logs) {
            logs.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Captcha')
                    .setDescription(
                        `Un utilisateur vient d'être expulsé car il n'a pas résolu son captcha dans les temps.\n` +
                        `> **Utilisateur:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}\n` +
                        `> **Code à résoudre:** \`${code}\``
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};