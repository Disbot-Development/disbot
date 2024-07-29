const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, StringSelectMenuBuilder } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class AntiLinkCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'antilink',
            description: 'Configurer le système d\'anti-link.',
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

        if (modules.includes('antilink')) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-link')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-link est de bloquer les messages qui contiennent des liens interdits.\n` +
                        `Cela permet d'anticiper la promotion de liens suspects (ou non).\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> - **Liens interdits:** ${this.client.config.antilink.type[await this.client.database.get(`${interaction.guild.id}.antilink.type`)] || 'Aucun'}\n` +
                        `> - **Durée rendu muet:** ${await this.client.database.get(`${interaction.guild.id}.antilink.duration`) ? `${await this.client.database.get(`${interaction.guild.id}.antilink.duration`)} minute${await this.client.database.get(`${interaction.guild.id}.antilink.duration`) > 1 ? 's' : ''}` : `${this.client.config.antilink.duration} minute${this.client.config.antilink.duration > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> - **Information supplémentaire:** Tous les utilisateurs et bots Discord n'étant pas inscris dans la liste blanche se verront affectés par l'anti-link.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId('antilink-type')
                        .setPlaceholder('S\'il-vous-plaît, sélectionnez un type.')
                        .setOptions(
                            Object.entries(this.client.config.antilink.type).map((type) => {
                                return {
                                    label: type[1],
                                    value: type[0]
                                }
                            })
                        )
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antilink-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver'),
                        new ButtonBuilder()
                        .setCustomId('antilink-configure')
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
                    .setTitle('Anti-link')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-link est de bloquer les messages qui contiennent des liens interdits.\n` +
                        `Cela permet d'anticiper la promotion de liens suspects (ou non).\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Désactivé ${this.client.config.emojis.no}\n` +
                        `> - **Information supplémentaire:** Il est vivement conseillé d'activer le système d'anti-link.`
                    )
                    .setColor(Colors.Red)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId('antilink-type')
                        .setPlaceholder('S\'il-vous-plaît, sélectionnez un type.')
                        .setOptions(
                            Object.entries(this.client.config.antilink.type).map((type) => {
                                return {
                                    label: type[1],
                                    value: type[0]
                                }
                            })
                        )
                        .setDisabled(true)
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antilink-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Activer'),
                        new ButtonBuilder()
                        .setCustomId('antilink-configure')
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