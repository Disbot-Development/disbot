const Event = require('../../Managers/Structures/Event');
const { GuildMember, User } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class MuteCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'muteCreate'
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

        if (modules.includes('logs') && member.guild.channels.resolve(await this.client.database.get(`${member.guild.id}.logs.channel`))) {
            member.guild.channels.resolve(await this.client.database.get(`${member.guild.id}.logs.channel`)).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Parole regagnée')
                    .setDescription(
                        `Un membre vient de regagner la parole.\n` +
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