const { User, Guild } = require('discord.js');

const MessageEmbed = require('../../Managers/MessageEmbed');
const Event = require('../../Managers/Structures/Event');

module.exports = class BanDeleteEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'banDelete'
        });
    };

    /**
     * 
     * @param {Guild} guild
     * @param {User} author
     * @param {User} user
     * @param {String} reason
     */
    
    async run (guild, author, user, reason) {
        const modules = await this.client.database.get(`${guild.id}.modules`) || [];
        const logsId = await this.client.database.get(`${guild.id}.logs.channel`);
        const logs = logsId ? await guild.channels.fetch(logsId).catch(() => undefined) : undefined;

        if (modules.includes('logs') && logs) {
            logs.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Débannissement')
                    .setDescription(
                        `Un utilisateur vient d\'être débanni.\n` +
                        `> **Auteur:** ${author} - \`${author.tag}\` - ${author.id}\n` +
                        `> **Utilisateur:** ${user} - \`${user.tag}\` - ${user.id}\n` +
                        `> **Raison:** ${reason}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};