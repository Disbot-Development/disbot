const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class UnmuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unmute',
            description: 'Permet de redonner la parole à un membre du serveur.',
            category: 'moderation',
            perms: [PermissionFlagsBits.ModerateMembers],
            meperms: [PermissionFlagsBits.ModerateMembers],
            options: [
                {
                    name: 'member',
                    description: 'Le membre à qui vous souhaitez redonner la parole.',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'La raison pour laquelle le membre regagnera la parole.',
                    type: ApplicationCommandOptionType.String
                }
            ]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    run (interaction) {
        const member = interaction.options.getMember('member');
        const reason = interaction.options.getString('reason') || 'Aucun raison spécifiée.';

        if (!interaction.member.isAdmin() && member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('Vous ne pouvez pas redonner la parole à un membre ayant un rôle plus haut que le votre.')
            ],
            ephemeral: true
        });

        if (!member.isCommunicationDisabled()) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('Ce membre n\'a pas été rendu muet.')
            ],
            ephemeral: true
        });

        member.timeout(null, reason)
        .then(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('SUCCESS')
                    .setDescription(
                        `\`${member.user.tag}\` vient de regagner la parole.\n` +
                        `> **Raison:** ${reason}`
                    )
                ]
            });

            member.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Parole regagnée')
                    .setDescription(
                        `Vous avez regagné la parole sur \`${interaction.guild.name}\`.\n` +
                        `> **Raison:** ${reason}`
                    )
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel(`Envoyé depuis: ${interaction.guild.name}`)
                        .setCustomId('sent-from')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                    )
                ]
            })
            .catch(() => 0);

            this.client.emit('muteDelete', interaction.user, member, reason);
        })
        .catch(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Je n\'ai pas pu redonner la parole à ce membre.')
                ],
                ephemeral: true
            });
        });
    };
};