const { ButtonInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

const MessageEmbed = require('../../../Commons/MessageEmbed');
const Button = require('../../../Core/Structures/Button');

module.exports = class CaptchaResetAfterRolesButton extends Button {
    constructor(client) {
        super(client, {
            name: 'captcha-reset-after-roles',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles]
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        await this.client.database.delete(`${interaction.guild.id}.captcha.roles.after`);

        interaction.update({
            embeds: [
                new MessageEmbed()
                .setTitle('Captcha')
                .setDescription(
                    `${this.client.config.emojis.help} Le but du système de captcha est de faire remplir un formulaire avec un code à déchiffrer à tous les nouveaux membres qui rejoindront le serveur.\n` +
                    `Cela permet de sécuriser votre serveur en évitant l'attaque de comptes Discord robotisés malveillants.\n\n` +
                    
                    `${this.client.config.emojis.settings}・**Configuration:**\n` +
                    `> - **Statut:** Activé ${this.client.config.emojis.yes}\n` +
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
    };
};