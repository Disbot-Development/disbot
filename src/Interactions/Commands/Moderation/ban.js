const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            description: 'Permet de bannir un membre du serveur.',
            category: 'moderation',
            perms: [PermissionFlagsBits.BanMembers],
            meperms: [PermissionFlagsBits.BanMembers],
            options: [
                {
                    name: 'member',
                    description: 'Le membre que vous souhaitez bannir.',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'La raison du bannissement.',
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
                .setDescription('Vous ne pouvez pas bannir un membre ayant un rôle plus haut que le votre.')
            ],
            ephemeral: true
        });

        member.ban({ reason })
        .then(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('SUCCESS')
                    .setDescription(
                        `\`${member.user.tag}\` vient d'être banni du serveur.\n` +
                        `> **Raison:** ${reason}`
                    )
                ]
            });

            member.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Bannissement')
                    .setDescription(
                        `Vous avez été banni de \`${interaction.guild.name}\`.\n` +
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

            this.client.emit('banCreate', interaction.user, member, reason);
        })
        .catch(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Je n\'ai pas pu bannir ce membre.')
                ],
                ephemeral: true
            });
        });
    };
};