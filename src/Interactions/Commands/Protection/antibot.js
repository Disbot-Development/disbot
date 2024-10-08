const { CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

const MessageEmbed = require('../../../Commons/MessageEmbed');
const Command = require('../../../Core/Structures/Command');

module.exports = class AntiBotCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'antibot',
            description: 'Configurer le système d\'anti-bot.',
            category: 'protection',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.KickMembers]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async run (interaction) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];

        if (modules.includes('antibot')) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-bot')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-bot est de bloquer la venue de nouveaux bots Discord sur le serveur.\n` +
                        `Cela permet d'éviter l'introduction de robots malveillants.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Statut:** Activé ${this.client.config.emojis.yes}\n` +
                        `> - **Information supplémentaire:** Si vous souhaitez un bot Discord dont vous avez confiance, vous pouvez désactiver temporairement le système d'anti-bot.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antibot-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver')
                    )
                ]
            });
        } else {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-bot')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-bot est de bloquer la venue de nouveaux bots Discord sur le serveur.\n` +
                        `Cela permet d'éviter l'introduction de robots malveillants.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Statut:** Désactivé ${this.client.config.emojis.no}\n` +
                        `> - **Information supplémentaire:** Il est vivement conseillé d'activer le système d'anti-bot.`
                    )
                    .setColor(Colors.Red)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antibot-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Activer')
                    )
                ]
            });
        };
    };
};