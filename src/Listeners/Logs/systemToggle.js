const { ButtonInteraction } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class systemToggleEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'systemToggle'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     * @param {String} name
     */
    
    async run (interaction, name) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];
        const logsId = await this.client.database.get(`${interaction.guild.id}.logs.channel`);
        const logs = logsId ? await interaction.guild.channels.fetch(logsId).catch(() => undefined) : undefined;

        const state = modules.includes(name.replace('-', '').toLowerCase());

        if (modules.includes('logs') && logs) {
            logs.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle(name)
                    .setDescription(
                        `Le système d'${name.toLowerCase()} vient d'être ${state ? 'désactivé' : 'activé'}.\n` +
                        `> **Auteur:** ${interaction.user} - \`${interaction.user.tag}\` - ${interaction.user.id}\n` +
                        `> **Status:** ${state ? `Désactivé ${this.client.config.emojis.no}` : `Activé ${this.client.config.emojis.yes}`}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};