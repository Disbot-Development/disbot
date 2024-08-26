const { ChannelSelectMenuInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

const SelectMenu = require('../../../Core/Structures/SelectMenu');
const MessageEmbed = require('../../../Commons/MessageEmbed');

module.exports = class LogsChannelSelectMenu extends SelectMenu {
    constructor(client) {
        super(client, {
            name: 'logs-channel'
        });
    };

    /**
     * 
     * @param {ChannelSelectMenuInteraction} interaction
     */

    async run (interaction) {
        const channel = interaction.channels.first();
        await this.client.database.set(`${interaction.guild.id}.logs.channel`, channel.id);

        interaction.update({
            embeds: [
                new MessageEmbed()
                .setTitle('Logs')
                .setDescription(
                    `${this.client.config.emojis.help} Le but du système de logs est de répertorier les actions importantes que j'ai réalisé sur le serveur.\n` +
                    `Cela permet de suivre mes actions et les raisons de mes actions.\n\n` +
                        
                    `${this.client.config.emojis.settings}・**Configuration:**\n` +
                    `> **Statut:** Activé ${this.client.config.emojis.yes}\n` +
                    `> **Salon de logs:** ${interaction.guild.channels.resolve(await this.client.database.get(`${interaction.guild.id}.logs.channel`)) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                    `> **Information supplémentaire:** Veillez à ce que je garde l'accès au salon. Faites attention à qui vous donnez l'accès aux logs.`
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

        channel.send({
        embeds: [
            new MessageEmbed()
            .setStyle('SUCCESS')
            .setDescription('Ce salon a été défini comme le salon des logs.')
        ]
        })
        .catch(() => 0);
    };
};