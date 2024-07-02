const Button = require('../../../Managers/Structures/Button');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require('discord.js');

module.exports = class AntiSpamToggleButton extends Button {
    constructor(client) {
        super(client, {
            name: 'antispam-toggle',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.ManageMessages]
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    run (interaction) {
        const modules = interaction.guild.getModules();

        this.client.emit('antispamToggle', interaction, modules);

        if (modules.includes('antispam')) {
            interaction.guild.removeModule('antispam');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-spam')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-spam est de bloquer les utilisateurs qui tentent d'envoyer des messages trop rapidement.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque d'utilisateurs Discord malveillants.\n\n` +

                        `> **Status:** Désactivé ${this.client.config.emojis.no}\n` +
                        `> **Information supplémentaire:** Il est vivement conseillé d'activer le système d'anti-spam.`
                    )
                    .setColor(Colors.Red)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antispam-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Activer'),
                        new ButtonBuilder()
                        .setCustomId('antispam-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                        .setDisabled(true)
                    )
                ]
            });
        } else {
            interaction.guild.addModule('antispam');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-spam')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-spam est de bloquer les utilisateurs qui tentent d'envoyer des messages trop rapidement.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque d'utilisateurs Discord malveillants.\n\n` +
                        
                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Limite de messages en ${this.client.config.antispam.timeout} seconde${this.client.config.antispam.timeout > 1 ? 's' : ''}:** ${interaction.guild.getData('antispam.limit') ? `${interaction.guild.getData('antispam.limit')} message${interaction.guild.getData('antispam.limit') > 1 ? 's' : ''}` : `${this.client.config.antispam.limit} message${this.client.config.antispam.limit > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> **Durée de l'exclusion:** ${interaction.guild.getData('antispam.duration') ? `${interaction.guild.getData('antispam.duration')} minute${interaction.guild.getData('antispam.duration') > 1 ? 's' : ''}` : `60 minutes (par défaut)`}\n` +
                        `> **Information supplémentaire:** Tous les utilisateurs n'étant pas intégrés dans la liste blanche se verront affectés par l'anti-spam.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antispam-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver'),
                        new ButtonBuilder()
                        .setCustomId('antispam-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                    )
                ]
            });
        };
    };
};