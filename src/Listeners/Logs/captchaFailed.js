const Event = require('../../Managers/Structures/Event');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { Guild } = require('discord.js');

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
    
    run (guild, member) {
        const modules = guild.getModules();

        if (modules.includes('logs') && guild.channels.resolve(guild.getData('logs.channel'))) {
            guild.channels.resolve(guild.getData('logs.channel')).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Captcha')
                    .setDescription(
                        `Un utilisateur vient d'être expulsé car il n'a pas résolu son captcha dans les temps.\n` +
                        `> **Utilisateur:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}\n` +
                        `> **Code à résoudre:** \`${member.getData('captcha.code')}\``
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};