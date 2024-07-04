const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
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

        if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('Vous ne pouvez pas bannir un membre ayant un rôle plus haut que le votre.')
            ],
            ephemeral :true
        });

        member.ban({ reason })
        .then(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('SUCCESS')
                    .setDescription(
                        `\`${member.user.tag}\` vient d'être banni du server.\n` +
                        `> **Raison:** ${reason}`
                    )
                ]
            });

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