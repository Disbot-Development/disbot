const { Guild } = require('discord.js');

const MessageEmbed = require('../../Managers/MessageEmbed');
const Event = require('../../Managers/Structures/Event');

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
     */
    
    async run (guild, member) {
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
                        `> **Code à résoudre:** \`${await this.client.database.get(`${guild.id}.users.${member.user.id}.captcha.code`)}\``
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};