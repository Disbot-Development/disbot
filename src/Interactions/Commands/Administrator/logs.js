const { CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

const Command = require('../../../Core/Structures/Command');
const MessageEmbed = require('../../../Commons/MessageEmbed');

module.exports = class LogsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'logs',
            description: 'Configurer le système de logs.',
            category: 'administrator',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageChannels]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async run (interaction) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];

        if (modules.includes('logs')) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Logs')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système de logs est de répertorier les actions importantes que j'ai réalisé sur le serveur.\n` +
                        `Cela permet de suivre mes actions et les raisons de mes actions.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> - **Salon de logs:** ${interaction.guild.channels.resolve(await this.client.database.get(`${interaction.guild.id}.logs.channel`)) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> - **Information supplémentaire:** Veillez à ce que je garde l'accès au salon. Faites attention à qui vous donnez l'accès aux logs.`
                    )
                    .setColor(Colors.Green)
                ],
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
        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Logs')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système de logs est de répertorier les actions importantes que j'ai réalisé sur le serveur.\n` +
                        `Cela permet de suivre mes actions et les raisons de mes actions.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Désactivé ${this.client.config.emojis.no}\n` +
                        `> - **Information supplémentaire:** Il est vivement conseillé d'activer le système de logs.`
                    )
                    .setColor(Colors.Red)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('logs-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.yes)
                        .setLabel('Activer'),
                        new ButtonBuilder()
                        .setCustomId('logs-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                        .setDisabled(true)
                    )
                ]
            });
        };
    };
};