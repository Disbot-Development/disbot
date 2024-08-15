const { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js');

const Command = require('../../../Core/Structures/Command');
const MessageEmbed = require('../../../Commons/MessageEmbed');

module.exports = class MuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mute',
            description: 'Permet de rendre muet un membre du serveur.',
            category: 'moderation',
            perms: [PermissionFlagsBits.ModerateMembers],
            meperms: [PermissionFlagsBits.ModerateMembers],
            options: [
                {
                    name: 'member',
                    description: 'Le membre que vous souhaitez rendre muet.',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'duration',
                    description: 'La durée pendant laquelle le membre sera muet.',
                    type: ApplicationCommandOptionType.Number,
                    minValue: 0,
                    required: true
                },
                {
                    name: 'unit',
                    description: 'L\'unité de la durée pendant laquelle le membre sera muet.',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                    choices: [
                        {
                            name: 'Heures',
                            value: 'hours'
                        },
                        {
                            name:'Minutes',
                            value:'minutes'
                        },
                        {
                            name:'Secondes',
                            value:'seconds'
                        }
                    ]
                },
                {
                    name: 'reason',
                    description: 'La raison pour laquelle le membre sera muet.',
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
        const duration = interaction.options.getNumber('duration');
        const unit = interaction.options.getString('unit');
        const reason = interaction.options.getString('reason') || 'Aucun raison spécifiée.';

        let calculatedDuration;
        switch(unit) {
            case 'hours':
                calculatedDuration = duration * 1000 * 60 * 60;
                
                break;
            case 'minutes':
                calculatedDuration = duration * 1000 * 60;

                break;
            case 'seconds':
                calculatedDuration = duration * 1000;

                break;
        };

        if (calculatedDuration > 28 * 1000 * 60 * 60 * 24) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('La durée est trop longue. Elle est de 28 jours maximum.')
            ],
            ephemeral: true
        });

        let frenchUnit;
        switch(unit) {
            case 'hours':
                frenchUnit = `heure${duration > 1 ? 's' : ''}`;
            break;
            case 'minutes':
                frenchUnit = `minute${duration > 1 ? 's' : ''}`;
            break;
            case 'seconds':
                frenchUnit = `seconde${duration > 1 ? 's' : ''}`;
            break;
        };

        if (!interaction.member.isAdmin() && member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('Vous ne pouvez pas rendre muet un membre ayant un rôle plus haut que le votre.')
            ],
            ephemeral: true
        });

        member.timeout(calculatedDuration, reason)
        .then(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('SUCCESS')
                    .setDescription(
                        `\`${member.user.tag}\` vient d'être rendu muet.\n` +
                        `> **Durée:** ${duration} ${frenchUnit}\n` +
                        `> **Fin:** <t:${Math.round((Date.now() + calculatedDuration) / 1000)}:D> à <t:${Math.round((Date.now() + calculatedDuration) / 1000)}:T> (<t:${Math.round((Date.now() + calculatedDuration) / 1000)}:R>)\n` +
                        `> **Raison:** ${reason}`
                    )
                ]
            });

            member.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Rendu muet')
                    .setDescription(
                        `Vous avez été rendu muet sur \`${interaction.guild.name}\`.\n` +
                        `> **Durée:** ${duration} ${frenchUnit}\n` +
                        `> **Fin:** <t:${Math.round((Date.now() + calculatedDuration) / 1000)}:D> à <t:${Math.round((Date.now() + calculatedDuration) / 1000)}:T> (<t:${Math.round((Date.now() + calculatedDuration) / 1000)}:R>)\n` +
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

            this.client.emit('muteCreate', interaction.user, member, duration, calculatedDuration, frenchUnit, reason);
        })
        .catch(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Je n\'ai pas pu rendre muet ce membre.')
                ],
                ephemeral: true
            });
        });
    };
};