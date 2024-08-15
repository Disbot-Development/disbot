const { ButtonInteraction, PermissionFlagsBits, ChannelSelectMenuBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const Button = require('../../../Core/Structures/Button');

module.exports = class CaptchaConfigureButton extends Button {
    constructor(client) {
        super(client, {
            name: 'captcha-configure',
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
                    .setCustomId('captcha-toggle')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(this.client.config.emojis.no)
                    .setLabel('Désactiver')
                    .setDisabled(true),
                    new ButtonBuilder()
                    .setCustomId('captcha-configure')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.settings)
                    .setLabel('Configurer')
                    .setDisabled(true),
                    new ButtonBuilder()
                    .setCustomId('captcha-configure-after-roles')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.settings)
                    .setLabel('Configurer les rôles après vérification')
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ChannelSelectMenuBuilder()
                    .setCustomId('captcha-channel')
                    .setChannelTypes(ChannelType.GuildText)
                    .setPlaceholder('Sélectionnez un salon de vérification.')
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('captcha-channel-create')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(this.client.config.emojis.pen)
                    .setLabel('Créer'),
                    new ButtonBuilder()
                    .setCustomId('captcha-cancel')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.no)
                    .setLabel('Annuler'),
                    new ButtonBuilder()
                    .setCustomId('captcha-reset')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.wrench)
                    .setLabel('Réinitialiser')
                )
            ]
        });
    };
};