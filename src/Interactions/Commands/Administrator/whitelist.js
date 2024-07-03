const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class WhitelistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'whitelist',
            description: 'Ajouter/Retirer des utilisateurs de la liste blanche.',
            category: 'administrator',
            perms: [PermissionFlagsBits.Administrator]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    run (interaction) {
        interaction.guild.setData('whitelist', (interaction.guild.getData('whitelist') || []).filter((id) => interaction.guild.members.resolve(id)));
        
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Liste blanche')
                .setDescription(
                    `${this.client.config.emojis.help} Les utilisateurs inscrit dans la liste blanche ne seront pas affectés par la plupart des systèmes de protection. Faites attention aux utilisateurs inscrit.\n\n` +

                    `**Utilisateurs:**\n` +
                    `> ${(interaction.guild.getData('whitelist') || []).length ? interaction.guild.getData('whitelist').map((id) => interaction.guild.members.resolve(id)).join(', ') : 'Aucun utilisateur n\'est inscrit dans la liste blanche.'}`
                )
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('whitelist-add')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.yes)
                    .setLabel('Ajouter'),
                    new ButtonBuilder()
                    .setCustomId('whitelist-remove')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.no)
                    .setLabel('Retirer')
                )
            ]
        });
    };
};