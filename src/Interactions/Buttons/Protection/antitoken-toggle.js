const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require('discord.js');

const MessageEmbed = require('../../../Commons/MessageEmbed');
const Button = require('../../../Core/Structures/Button');

module.exports = class AntiTokenToggleButton extends Button {
    constructor(client) {
        super(client, {
            name: 'antitoken-toggle',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageMessages]
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];

        this.client.emit('systemToggle', interaction, 'Anti-token');

        if (modules.includes('antitoken')) {
            await this.client.database.pull(`${interaction.guild.id}.modules`, 'antitoken');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-token')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-token est de bloquer les messages qui contiennent des tokens d'utilisateurs ou robots Discord.\n` +
                        `Cela permet d'anticiper la fuite d'informations personnelles.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Statut:** Désactivé ${this.client.config.emojis.no}\n` +
                        `> - **Information supplémentaire:** Il est vivement conseillé d'activer le système d'anti-token.`
                    )
                    .setColor(Colors.Red)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antitoken-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Activer'),
                        new ButtonBuilder()
                        .setCustomId('antitoken-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                        .setDisabled(true)
                    )
                ]
            });
        } else {
            await this.client.database.push(`${interaction.guild.id}.modules`, 'antitoken');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-token')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-token est de bloquer les messages qui contiennent des tokens d'utilisateurs ou robots Discord.\n` +
                        `Cela permet d'anticiper la fuite d'informations personnelles.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Statut:** Activé ${this.client.config.emojis.yes}\n` +
                        `> - **Durée rendu muet:** ${await this.client.database.get(`${interaction.guild.id}.antitoken.duration`) ? `${await this.client.database.get(`${interaction.guild.id}.antitoken.duration`)} minute${await this.client.database.get(`${interaction.guild.id}.antitoken.duration`) > 1 ? 's' : ''}` : `${this.client.config.antitoken.duration} minute${this.client.config.antitoken.duration > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> - **Information supplémentaire:** Tous les utilisateurs et bots Discord n'étant pas inscris dans la liste blanche se verront affectés par l'anti-token.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antitoken-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver'),
                        new ButtonBuilder()
                        .setCustomId('antitoken-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                    )
                ]
            });
        };
    };
};