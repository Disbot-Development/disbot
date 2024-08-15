const { ButtonInteraction, GuildMember } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class WhiteListAddEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'whitelistAdd'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     * @param {GuildMember} member 
     */
    
    async run (interaction, member) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];
        const logsId = await this.client.database.get(`${interaction.guild.id}.logs.channel`);
        const logs = logsId ? await interaction.guild.channels.fetch(logsId).catch(() => undefined) : undefined;

        if (modules.includes('logs') && logs) {
            logs.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Liste blanche')
                    .setDescription(
                        `Un membre a été ajouté à la liste blanche.\n` +
                        `> **Auteur:** ${interaction.user} - \`${interaction.user.tag}\` - ${interaction.user.id}\n` +
                        `> **Membre:** ${member.user} - \`${member.user.tag}\` - ${member.user.id}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};