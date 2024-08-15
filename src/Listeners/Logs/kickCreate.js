const { GuildMember, User } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class KickCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'kickCreate'
        });
    };

    /**
     * 
     * @param {User} author
     * @param {GuildMember} member
     * @param {String} reason
     */
    
   async run (author, member, reason) {
        const modules = await this.client.database.get(`${member.guild.id}.modules`) || [];
        const logsId = await this.client.database.get(`${member.guild.id}.logs.channel`);
        const logs = logsId ? await member.guild.channels.fetch(logsId).catch(() => undefined) : undefined;

        if (modules.includes('logs') && logs) {
            logs.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Expulsion')
                    .setDescription(
                        `Un membre vient d\'être expulsé.\n` +
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