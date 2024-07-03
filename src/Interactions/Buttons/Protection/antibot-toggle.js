const Button = require('../../../Managers/Structures/Button');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require('discord.js');

module.exports = class AntiBotToggleButton extends Button {
    constructor(client) {
        super(client, {
            name: 'antibot-toggle',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageGuild]
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        const modules = interaction.guild.getModules();

        this.client.emit('antibotToggle', interaction, modules);

        if (modules.includes('antibot')) {
            interaction.guild.removeModule('antibot');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-bot')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-bot est de bloquer la venue de nouveaux bots Discord sur le serveur.\n` +
                        `Cela permet d'éviter l'introduction de robots malveillants.\n\n` +

                        `> **Status:** Désactivé ${this.client.config.emojis.no}\n` +
                        `> **Information supplémentaire:** Il est vivement conseillé d'activer le système d'anti-bot.`
                    )
                    .setColor(Colors.Red)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antibot-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Activer')
                    )
                ]
            });
        } else {
            interaction.guild.addModule('antibot');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-bot')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-bot est de bloquer la venue de nouveaux bots Discord sur le serveur.\n` +
                        `Cela permet d'éviter l'introduction de robots malveillants.\n\n` +

                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Information supplémentaire:** Si vous souhaitez un bot Discord dont vous avez confiance, vous pouvez désactiver temporairement le système d'anti-bot.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antibot-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver')
                    )
                ]
            });
        };
    };
};