const { ChannelSelectMenuInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, RoleSelectMenuBuilder, Colors } = require('discord.js');

const SelectMenu = require('../../../Core/Structures/SelectMenu');
const MessageEmbed = require('../../../Commons/MessageEmbed');

module.exports = class CaptchaChannelSelectMenu extends SelectMenu {
    constructor(client) {
        super(client, {
            name: 'captcha-channel'
        });
    };

    /**
     * 
     * @param {ChannelSelectMenuInteraction} interaction
     */

    async run (interaction) {
        const channel = interaction.channels.first();
        await this.client.database.set(`${interaction.guild.id}.captcha.channel`, channel.id);

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
                    .setLabel('Désactiver')
                    .setDisabled(true),
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
                ),
                new ActionRowBuilder()
                .addComponents(
                    new RoleSelectMenuBuilder()
                    .setCustomId('captcha-role')
                    .setPlaceholder('Sélectionnez un rôle pendant la vérification.')
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('captcha-role-create')
                    .setStyle(ButtonStyle.Success)
                    .setEmoji(this.client.config.emojis.pen)
                    .setLabel('Créer'),
                    new ButtonBuilder()
                    .setCustomId('captcha-cancel')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.no)
                    .setLabel('Annuler'),
                    new ButtonBuilder()
                    .setCustomId('captcha-reset')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.wrench)
                    .setLabel('Réinitialiser')
                )
            ]
        });
    };
};