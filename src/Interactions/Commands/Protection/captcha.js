const { CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

const Command = require('../../../Managers/Structures/Command');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class CaptchaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'captcha',
            description: 'Configurer le système de captcha.',
            category: 'protection',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageRoles]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction
     */

    async run (interaction) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];

        if (modules.includes('captcha')) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Captcha')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système de captcha est de faire remplir un formulaire avec un code à déchiffrer à tous les nouveaux membres qui rejoindront le serveur.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque de comptes Discord robotisés malveillants.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> - **Salon de vérification:** ${interaction.guild.channels.resolve(await this.client.database.get(`${interaction.guild.id}.captcha.channel`)) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> - **Rôle de vérification:** ${interaction.guild.roles.resolve(await this.client.database.get(`${interaction.guild.id}.captcha.roles.before`)) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> - **Rôle après vérification:** ${await this.client.database.get(`${interaction.guild.id}.captcha.roles.after`) ? (await this.client.database.get(`${interaction.guild.id}.captcha.roles.after`)).map((role) => interaction.guild.roles.resolve(role)) : `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> - **Information supplémentaire:** Si vous ne configurez pas le salon et le rôle de vérification (minimum), le système de captcha ne pourra pas fonctionner.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('captcha-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver'),
                        new ButtonBuilder()
                        .setCustomId('captcha-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer'),
                        new ButtonBuilder()
                        .setCustomId('captcha-configure-after-roles')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer les rôles après vérification')
                    )
                ]
            });
        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Captcha')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système de captcha est de faire remplir un formulaire avec un code à déchiffrer à tous les nouveaux membres qui rejoindront le serveur.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque de comptes Discord robotisés malveillants.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Status:** Désactivé ${this.client.config.emojis.no}\n` +
                        `> - **Information supplémentaire:** Il est vivement conseillé d'activer le système de captcha.`
                    )
                    .setColor(Colors.Red)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('captcha-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.yes)
                        .setLabel('Activer'),
                        new ButtonBuilder()
                        .setCustomId('captcha-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                        .setDisabled(true),
                        new ButtonBuilder()
                        .setCustomId('captcha-configure-after-roles')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer les rôles après vérification')
                        .setDisabled(true)
                    )
                ]
            });
        };
    };
};