const { CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

const Command = require('../../../Managers/Structures/Command');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class AntiSpamCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'antispam',
            description: 'Configurer le système d\'anti-spam.',
            category: 'protection',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.ManageMessages]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async run (interaction) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];

        if (modules.includes('antispam')) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-spam')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-spam est de bloquer les utilisateurs qui tentent d'envoyer des messages trop rapidement.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque d'utilisateurs Discord malveillants.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> - **Limite de messages en ${this.client.config.antispam.cooldown} seconde${this.client.config.antispam.cooldown > 1 ? 's' : ''}:** ${await this.client.database.get(`${interaction.guild.id}.antispam.limit`) ? `${await this.client.database.get(`${interaction.guild.id}.antispam.limit`)} message${await this.client.database.get(`${interaction.guild.id}.antispam.limit`) > 1 ? 's' : ''}` : `${this.client.config.antispam.limit} message${this.client.config.antispam.limit > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> - **Durée rendu muet:** ${await this.client.database.get(`${interaction.guild.id}.antispam.duration`) ? `${await this.client.database.get(`${interaction.guild.id}.antispam.duration`)} minute${await this.client.database.get(`${interaction.guild.id}.antispam.duration`) > 1 ? 's' : ''}` : `${this.client.config.antispam.duration} minute${this.client.config.antispam.duration > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> - **Information supplémentaire:** Tous les utilisateurs n'étant pas inscris dans la liste blanche se verront affectés par l'anti-spam.`
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
        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-spam')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-spam est de bloquer les utilisateurs qui tentent d'envoyer des messages trop rapidement.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque d'utilisateurs Discord malveillants.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Désactivé ${this.client.config.emojis.no}\n` +
                        `> - **Information supplémentaire:** Il est vivement conseillé d'activer le système d'anti-spam.`
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
        };
    };
};