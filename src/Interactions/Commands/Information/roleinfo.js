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
        const creationDate = parseInt(role.createdTimestamp / 1000);

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Informations du rôle')
                .setDescription(
                    `> **Rôle:** ${role}\n` +
                    `> **Nom:** ${role.name}\n` +
                    `> **Identifiant:** ${role.id}\n\n` +

                    `> **Administrateur:** ${role.isAdmin() ? this.client.config.emojis.yes : this.client.config.emojis.no}\n` +

                    `> **Membre${role.members.size > 1 ? 's' : ''}:** ${role.members.size} membre${role.members.size > 1 ? 's' : ''}\n` +
                    `> **Couleur:** \`${role.hexColor}\`\n` +
                    `> **Date de création:** <t:${creationDate}:D> à <t:${creationDate}:T> (<t:${creationDate}:R>)\n` +
                    `> **Affiché séparément :** ${role.hoist ? this.client.config.emojis.yes : this.client.config.emojis.no}\n` +
                    `> **Mentionnable:** ${role.mentionable ? this.client.config.emojis.yes : this.client.config.emojis.no}`
                )
                .setThumbnail(role.iconURL({ size: 4096 }))
            ]
        });
    };
};