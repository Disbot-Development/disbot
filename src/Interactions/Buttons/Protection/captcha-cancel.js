const Button = require('../../../Managers/Structures/Button');
const { ButtonInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = class CaptchaCancelButton extends Button {
    constructor(client) {
        super(client, {
            name: 'captcha-cancel',
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
                    .setCustomId('captcha-toggle')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(this.client.config.emojis.no)
                    .setLabel('Désactiver'),
                    new ButtonBuilder()
                    .setCustomId('captcha-configure')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.settings)
                    .setLabel('Configurer'),
                    new ButtonBuilder()
                    .setCustomId('captcha-configure-after-roles')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.settings)
                    .setLabel('Configurer les rôles après vérification')
                )
            ]
        });
    };
};