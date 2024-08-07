const { ButtonInteraction, PermissionFlagsBits, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelSelectMenuBuilder } = require('discord.js');

const Button = require('../../../Managers/Structures/Button');

module.exports = class LogsConfigureButton extends Button {
    constructor(client) {
        super(client, {
            name: 'logs-configure',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles]
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        interaction.update({
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('logs-toggle')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(this.client.config.emojis.no)
                    .setLabel('Désactiver')
                    .setDisabled(true),
                    new ButtonBuilder()
                    .setCustomId('logs-configure')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.settings)
                    .setLabel('Configurer')
                    .setDisabled(true)
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ChannelSelectMenuBuilder()
                    .setCustomId('logs-channel')
                    .setChannelTypes(ChannelType.GuildText)
                    .setPlaceholder('Sélectionnez un salon.')
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('logs-create')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(this.client.config.emojis.pen)
                    .setLabel('Créer'),
                    new ButtonBuilder()
                    .setCustomId('logs-cancel')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.no)
                    .setLabel('Annuler'),
                    new ButtonBuilder()
                    .setCustomId('logs-reset')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.wrench)
                    .setLabel('Réinitialiser')
                )
            ]
        });
    };
};