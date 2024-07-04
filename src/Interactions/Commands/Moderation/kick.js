const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class KickCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'kick',
            description: 'Permet d\'expulser un membre du serveur.',
            category: 'moderation',
            perms: [PermissionFlagsBits.KickMembers],
            meperms: [PermissionFlagsBits.KickMembers],
            options: [
                {
                    name: 'member',
                    description: 'Le membre que vous souhaitez expulser.',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'La raison de l\'expulsion.',
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
                .setDescription('Vous ne pouvez pas expulser un membre ayant un rôle plus haut que le votre.')
            ],
            ephemeral :true
        });

        member.kick({ reason })
        .then(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('SUCCESS')
                    .setDescription(
                        `\`${member.user.tag}\` vient d'être expulsé du server.\n` +
                        `> **Raison:** ${reason}`
                    )
                ]
            });

            this.client.emit('kickCreate', interaction.user, member, reason);
        })
        .catch(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Je n\'ai pas pu expulser ce membre.')
                ],
                ephemeral: true
            });
        });
    };
};