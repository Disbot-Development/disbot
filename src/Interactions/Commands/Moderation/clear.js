const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class ClearCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'clear',
            description: 'Permet de supprimer un certain nombre de messages.',
            category: 'moderation',
            perms: [PermissionFlagsBits.ManageMessages],
            meperms: [PermissionFlagsBits.ManageMessages],
            options: [
                {
                    name: 'amount',
                    description: 'Le nombre de messages que vous souhaitez supprimer.',
                    type: ApplicationCommandOptionType.Number,
                    minValue: 1,
                    maxValue: 100,
                    required: true
                },
                {
                    name: 'member',
                    description: 'Le membre dont vous souhaitez supprimer les messages.',
                    type: ApplicationCommandOptionType.User
                }
            ]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async run (interaction) {
        const amount = interaction.options.getNumber('amount');
        const member = interaction.options.getMember('member');

        const filteredMessages = (await interaction.channel.messages.fetch({ limit: amount }));

        const messages = member ? filteredMessages.filter((message) => message.author.id === member.user.id) : filteredMessages;

        interaction.channel.bulkDelete(messages)
        .then(({ size }) => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('SUCCESS')
                    .setDescription(size ? `${size} message${size > 1 ? 's' : ''} ${member ? `de ${member} ` : ''}${size > 1 ? 'ont été supprimés' : 'a été supprimé'}.` : 'Je n\'ai pas pu supprimer de message.')
                ],
                ephemeral: true
            });
        })
        .catch(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Je n\'ai pas pu supprimer de message.')
                ],
                ephemeral: true
            });
        });
    };
};