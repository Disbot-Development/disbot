const { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const Command = require('../../../Core/Structures/Command');
const MessageEmbed = require('../../../Commons/MessageEmbed');

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

    async run (interaction) {
        const user = interaction.options.getUser('member');
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        const reason = interaction.options.getString('reason') || 'Aucun raison spécifiée.';

        if (!interaction.member.isAdmin() && member && member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('Vous ne pouvez pas bannir un membre ayant un rôle plus haut que le votre.')
            ],
            ephemeral: true
        });

        interaction.guild.bans.create(user.id, { reason })
        .then(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('SUCCESS')
                    .setDescription(
                        `\`${user.tag}\` vient d'être banni du serveur.\n` +
                        `> **Raison:** ${reason}`
                    )
                ]
            });

            user.send({
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

            this.client.emit('banCreate', interaction.guild, interaction.user, user, reason);
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