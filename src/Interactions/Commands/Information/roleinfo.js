const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, ApplicationCommandOptionType } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class RoleInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'roleinfo',
            description: 'Get role informations.',
            category: 'information',
            options: [
                {
                    name: 'role',
                    description: 'The role to get informations.',
                    type: ApplicationCommandOptionType.Role,
                    required: true
                }
            ]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction
     */

    run (interaction) {
        const role = interaction.options.getRole('role');

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Informations du rôle')
                .setDescription(
                    `> **Rôle:** ${role}\n` +
                    `> **Identifiant:** ${role.id}\n\n` +

                    `> **Administrateur:** ${role.isAdmin() ? this.client.config.emojis.yes : this.client.config.emojis.no}\n` +

                    `> **Membre${role.members.size > 1 ? 's' : ''}:** ${role.members.size}\n` +
                    `> **Couleur:** ${role.hexColor}\n` +
                    `> **Date de création:** <t:${parseInt(role.createdTimestamp / 1000)}:f>\n` +
                    `> **Affiché séparément :** ${role.hoist ? this.client.config.emojis.yes : this.client.config.emojis.no}\n` +
                    `> **Mentionnable:** ${role.mentionable ? this.client.config.emojis.yes : this.client.config.emojis.no}`
                )
                .setThumbnail(role.iconURL() ? role.iconURL({ size: 4096 }) : null)
            ]
        });
    };
};