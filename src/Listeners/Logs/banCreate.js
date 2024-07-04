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
    
    async run (author, member, reason) {
        const modules = await this.client.database.get(`${guild.id}.modules`);

        if (modules.includes('logs') && member.guild.channels.resolve(await this.client.database.get(`${guild.id}.logs.channel`))) {
            member.guild.channels.resolve(await this.client.database.get(`${guild.id}.logs.channel`)).send({
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