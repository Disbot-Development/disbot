const Event = require('../../Managers/Structures/Event');
const { GuildMember, User } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class BanCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'banCreate'
        });
    };

    /**
     * 
     * @param {User} author
     * @param {GuildMember} member
     * @param {String} reason
     */
    
    run (author, member, reason) {
        const modules = member.guild.getModules();

        if (modules.includes('logs') && member.guild.channels.resolve(member.guild.getData('logs.channel'))) {
            member.guild.channels.resolve(member.guild.getData('logs.channel')).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Bannissement')
                    .setDescription(
                        `Un membre vient d\'être banni.\n` +
                        `> **Auteur:** ${author} - \`${author.tag}\` - ${author.id}\n` +
                        `> **Membre:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}\n` +
                        `> **Raison:** ${reason}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};