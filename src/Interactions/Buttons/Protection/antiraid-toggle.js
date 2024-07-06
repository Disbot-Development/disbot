const Button = require('../../../Managers/Structures/Button');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, Colors } = require('discord.js');

module.exports = class AntiRaidToggleButton extends Button {
    constructor(client) {
        super(client, {
            name: 'antiraid-toggle',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageGuild]
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];

        this.client.emit('antiraidToggle', interaction);

        if (modules.includes('antiraid')) {
            await this.client.database.pull(`${interaction.guild.id}.modules`, 'antiraid');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-raid')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-raid est de bloquer la venue de nouveaux membres sur le serveur si trop d'utilisateurs rejoignent en peu de temps.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque de comptes Discord robotisés malveillants.\n\n` +

                        `> **Status:** Désactivé ${this.client.config.emojis.no}\n` +
                        `> **Information supplémentaire:** Il est vivement conseillé d'activer le système d'anti-raid.`
                    )
                    .setColor(Colors.Red)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antiraid-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Activer'),
                        new ButtonBuilder()
                        .setCustomId('antiraid-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                        .setDisabled(true)
                    )
                ]
            });
        } else {
            if (!interaction.guild.features.includes('COMMUNITY')) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Le serveur n\'a pas le mode communauté activé.')
                ],
                ephemeral: true
            });
            
            await this.client.database.push(`${interaction.guild.id}.modules`, 'antiraid');

            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-raid')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-raid est de bloquer la venue de nouveaux membres sur le serveur si trop d'utilisateurs rejoignent en peu de temps.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque de comptes Discord robotisés malveillants.\n\n` +

                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Limite de comptes en ${this.client.config.antiraid.timeout} seconde${this.client.config.antiraid.timeout > 1 ? 's' : ''}:** ${await this.client.database.get(`${interaction.guild.id}.antiraid.limit`) ? `${await this.client.database.get(`${interaction.guild.id}.antiraid.limit`)} compte${await this.client.database.get(`${interaction.guild.id}.antiraid.limit`) > 1 ? 's' : ''}` : `${this.client.config.antiraid.limit} message${this.client.config.antiraid.limit > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> **Information supplémentaire:** Il est important que le mode communauté soit activé sur le serveur. Si le mode raid venait à s'activez, désactivez le depuis \`Paramètres du serveur\` ➜ \`Invitations\` ➜ \`Activer les invitations\`.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antiraid-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver'),
                        new ButtonBuilder()
                        .setCustomId('antiraid-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                    )
                ]
            });
        };
    };
};