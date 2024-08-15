const { CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

const Command = require('../../../Core/Structures/Command');
const MessageEmbed = require('../../../Commons/MessageEmbed');

module.exports = class AntiTokenCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'antitoken',
            description: 'Configurer le système d\'anti-token.',
            category: 'protection',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageMessages]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async run (interaction) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];

        if (modules.includes('antitoken')) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-token')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-token est de bloquer les messages qui contiennent des tokens d'utilisateurs ou robots Discord.\n` +
                        `Cela permet d'anticiper la fuite d'informations personnelles.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Activé ${this.client.config.emojis.yes}\n` +
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
        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-token')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-token est de bloquer les messages qui contiennent des tokens d'utilisateurs ou robots Discord.\n` +
                        `Cela permet d'anticiper la fuite d'informations personnelles.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Désactivé ${this.client.config.emojis.no}\n` +
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
        };
    };
};