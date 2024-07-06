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
     * @param {Number} duration
     * @param {Number} calculatedDuration
     * @param {String} unit
     * @param {String} reason
     */
    
    async run (author, member, duration, calculatedDuration, unit, reason) {
        const modules = await this.client.database.get(`${member.guild.id}.modules`) || [];

        if (modules.includes('logs') && member.guild.channels.resolve(await this.client.database.get(`${member.guild.id}.logs.channel`))) {
            member.guild.channels.resolve(await this.client.database.get(`${member.guild.id}.logs.channel`)).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Mute')
                    .setDescription(
                        `Un membre vient d\'être rendu muet.\n` +
                        `> **Auteur:** ${author} - \`${author.tag}\` - ${author.id}\n` +
                        `> **Membre:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}\n` +
                        `> **Durée:** ${duration} ${unit}\n` +
                        `> **Fin:** <t:${Math.round((Date.now() + calculatedDuration) / 1000)}:D> à <t:${Math.round((Date.now() + calculatedDuration) / 1000)}:T> (<t:${Math.round((Date.now() + calculatedDuration) / 1000)}:R>)\n` +
                        `> **Raison:** ${reason}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};