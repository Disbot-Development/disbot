const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require('discord.js');

const MessageEmbed = require('../../../Managers/MessageEmbed');
const Button = require('../../../Managers/Structures/Button');

module.exports = class AntiAltToggleButton extends Button {
    constructor(client) {
        super(client, {
            name: 'antialt-toggle',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.KickMembers]
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];

        this.client.emit('systemToggle', interaction, 'Anti-alt');

        if (modules.includes('antialt')) {
            await this.client.database.pull(`${interaction.guild.id}.modules`, 'antialt');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-alt')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-alt est de bloquer les utilisateurs qui tentent de rejoindre avec un compte créé en dessous de la date minimale.\n` +
                        `Cela permet d'anticiper les potentielles attaques de robots malveillants.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Désactivé ${this.client.config.emojis.no}\n` +
                        `> - **Information supplémentaire:** Il est vivement conseillé d'activer le système d'anti-alt.`
                    )
                    .setColor(Colors.Red)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antialt-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Activer'),
                        new ButtonBuilder()
                        .setCustomId('antialt-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                        .setDisabled(true)
                    )
                ]
            });
        } else {
            await this.client.database.push(`${interaction.guild.id}.modules`, 'antialt');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-alt')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-alt est de bloquer les utilisateurs qui tentent de rejoindre avec un compte créé en dessous de la date minimale.\n` +
                        `Cela permet d'anticiper les potentielles attaques de robots malveillants.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> - **Date minimale:** ${await this.client.database.get(`${interaction.guild.id}.antialt.age`) ? `${await this.client.database.get(`${interaction.guild.id}.antialt.age`)} heure${await this.client.database.get(`${interaction.guild.id}.antialt.age`) > 1 ? 's' : ''}` : `${this.client.config.antialt.age} heure${this.client.config.antialt.age > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> - **Information supplémentaire:** Ce système n'affectera pas les bots Discord.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antialt-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver'),
                        new ButtonBuilder()
                        .setCustomId('antialt-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                    )
                ]
            });
        };
    };
};