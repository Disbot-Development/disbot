const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

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

        if (member.roles.highest.position >= interaction.member.roles.highest.position) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('Vous ne pouvez pas renre muet un membre ayant un rôle plus haut que le votre.')
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