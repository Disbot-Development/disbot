const Button = require('../../../Managers/Structures/Button');
const { ButtonInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder } = require('discord.js');

module.exports = class CaptchaConfigureAfterRolesButton extends Button {
    constructor(client) {
        super(client, {
            name: 'captcha-configure-after-roles',
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
                    .setDisabled(true)
                ),
                new ActionRowBuilder()
                .addComponents(
                    new RoleSelectMenuBuilder()
                    .setCustomId('captcha-after-roles')
                    .setPlaceholder('Sélectionnez des rôles après vérification.')
                    .setMaxValues(10)
                ),
                new ActionRowBuilder()
                .addComponents(
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