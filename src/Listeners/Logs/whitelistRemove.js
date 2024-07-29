const { ButtonInteraction, GuildMember } = require('discord.js');
const Event = require('../../Managers/Structures/Event');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class WhiteListRemoveEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'whitelistRemove'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     * @param {GuildMember} member 
     */
    
    async run (interaction, member) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];
        const logsId = await this.client.database.get(`$interaction.{guild.id}.logs.channel`);
        const logs = logsId ? await interaction.guild.channels.fetch(logsId).catch(() => undefined) : undefined;

        if (modules.includes('logs') && logs) {
            logs.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Liste blanche')
                    .setDescription(
                        `Un membre a été retiré de la liste blanche.\n` +
                        `> **Auteur:** ${interaction.user} - \`${interaction.user.tag}\` - ${interaction.user.id}\n` +
                        `> **Membre:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};