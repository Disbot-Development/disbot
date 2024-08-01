const Button = require('../../../Managers/Structures/Button');
const { ButtonInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = class LogsCancelButton extends Button {
    constructor(client) {
        super(client, {
            name: 'logs-cancel',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles]
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    run (interaction) {
        interaction.update({
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('logs-toggle')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(this.client.config.emojis.no)
                    .setLabel('Désactiver'),
                    new ButtonBuilder()
                    .setCustomId('logs-configure')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.settings)
                    .setLabel('Configurer')
                )
            ]
        });
    };
};