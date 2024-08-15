const { CommandInteraction, TextChannel } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class ChannelLockedEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'channelLocked'
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {TextChannel} channel
     * @param {Boolean} isLocked
     */
    
   async run (interaction, channel, isLocked) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];
        const logsId = await this.client.database.get(`${interaction.guild.id}.logs.channel`);
        const logs = logsId ? await interaction.guild.channels.fetch(logsId).catch(() => undefined) : undefined;

        if (modules.includes('logs') && logs) {
            logs.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`Salon ${isLocked ? 'déverrouillé' : 'verrouillé'}`)
                    .setDescription(
                        `Un salon vient d'être ${isLocked ? 'déverrouillé' : 'verrouillé'}.\n` +
                        `> **Auteur:** ${interaction.user} - \`${interaction.user.tag}\` - ${interaction.user.id}\n` +
                        `> **Salon:** ${channel} - \`${channel.name}\` - ${channel.id}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};