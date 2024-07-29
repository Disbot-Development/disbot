const Button = require('../../../Managers/Structures/Button');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Colors, StringSelectMenuBuilder } = require('discord.js');

module.exports = class AntiLinkToggleButton extends Button {
    constructor(client) {
        super(client, {
            name: 'antilink-toggle',
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

        this.client.emit('systemToggle', interaction, 'Anti-link');

        if (modules.includes('antilink')) {
            await this.client.database.pull(`${interaction.guild.id}.modules`, 'antilink');

            interaction.update({
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
        } else {
            await this.client.database.push(`${interaction.guild.id}.modules`, 'antilink');

            interaction.update({
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
        };
    };
};