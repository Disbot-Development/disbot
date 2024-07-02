const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class AntiRaidCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'antiraid',
            description: 'Configurer le système d\'anti-raid.',
            category: 'protection',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageGuild]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async run (interaction) {
        const modules = interaction.guild.getModules();

        if (modules.includes('antiraid')) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-raid')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-raid est de bloquer la venue de nouveaux membres sur le serveur si trop d'utilisateurs rejoignent en peu de temps.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque de comptes Discord robotisés malveillants.\n\n` +

                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Limite de comptes en ${this.client.config.antiraid.timeout} seconde${this.client.config.antiraid.timeout > 1 ? 's' : ''}:** ${interaction.guild.getData('antiraid.limit') ? `${interaction.guild.getData('antiraid.limit')} compte${interaction.guild.getData('antiraid.limit') > 1 ? 's' : ''}` : `${this.client.config.antiraid.limit} message${this.client.config.antiraid.limit > 1 ? 's' : ''} (par défaut)`}\n` +
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
        } else {
            interaction.reply({
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
        };
    };
};