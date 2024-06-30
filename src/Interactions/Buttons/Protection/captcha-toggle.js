const Button = require('../../../Managers/Structures/Button');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require('discord.js');

module.exports = class CaptchaToggleButton extends Button {
    constructor(client) {
        super(client, {
            name: 'captcha-toggle',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles]
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    run (interaction) {
        const modules = interaction.guild.getModules();

        this.client.emit('captchaToggle', interaction, modules);

        if (modules.includes('captcha')) {
            interaction.guild.removeModule('captcha');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Captcha')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système de captcha est de faire remplir un formulaire avec un code à déchiffrer à tous les nouveaux membres qui rejoindront le serveur.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque de comptes Discord robotisés malveillants.\n\n` +
                        `> **Status:** Désactivé ${this.client.config.emojis.no}\n` +
                        `> **Information supplémentaire:** Il est vivement conseillé d'activer le système de captcha.`
                    )
                    .setColor(Colors.Red)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('captcha-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.yes)
                        .setLabel('Activer'),
                        new ButtonBuilder()
                        .setCustomId('captcha-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                        .setDisabled(true),
                    )
                ]
            });
        } else {
            interaction.guild.addModule('captcha');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Captcha')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système de captcha est de faire remplir un formulaire avec un code à déchiffrer à tous les nouveaux membres qui rejoindront le serveur.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque de comptes Discord robotisés malveillants.\n\n` +
                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Salon de vérification:** ${interaction.guild.channels.resolve(interaction.guild.getData('captcha.channel')) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> **Rôle de vérification:** ${interaction.guild.roles.resolve(interaction.guild.getData('captcha.roles.before')) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> **Rôle après vérification:** ${interaction.guild.roles.resolve(interaction.guild.getData('captcha.roles.after')) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> **Information supplémentaire:** Si vous ne configurez pas le salon et le rôle de vérification (minimum), le système de captcha ne pourra pas fonctionner.`
                    )
                    .setColor(Colors.Green)
                ],
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
                    )
                ]
            });
        };
    };
};