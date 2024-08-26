const { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const MessageEmbed = require('../../../Commons/MessageEmbed');
const Command = require('../../../Core/Structures/Command');

module.exports = class UnbanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'unban',
            description: 'Permet de débannir un utilisateur.',
            category: 'moderation',
            perms: [PermissionFlagsBits.BanMembers],
            meperms: [PermissionFlagsBits.BanMembers],
            options: [
                {
                    name: 'tag',
                    description: 'Le tag de l\'utilisateur que vous souhaitez débannir.',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true,
                    required: true
                },
                {
                    name: 'reason',
                    description: 'La raison du débannissement.',
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
        const id = interaction.options.getString('tag');
        const reason = interaction.options.getString('reason') || 'Aucun raison spécifiée.';

        if (!id) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('Je n\'ai pas trouvé cet utilisateur banni.')
            ],
            ephemeral: true
        });

        interaction.guild.bans.remove(id, reason)
        .then((user) => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('SUCCESS')
                    .setDescription(
                        `\`${user.tag}\` vient d'être débanni du serveur.\n` +
                        `> **Raison:** ${reason}`
                    )
                ]
            });

            user.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Débannissement')
                    .setDescription(
                        `Vous avez été débanni de \`${interaction.guild.name}\`.\n` +
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

            this.client.emit('banDelete', interaction.guild, interaction.user, user, reason);
        })
        .catch(() => {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Je n\'ai pas pu débannir ce membre.')
                ],
                ephemeral: true
            });
        });
    };

    /**
     * 
     * @param {AutocompleteInteraction} interaction
     */

    async autocomplete (interaction) {
        const focusedValue = interaction.options.getFocused();
        const filtered = (await interaction.guild.bans.fetch()).filter((ban) => ban.user.tag.includes(focusedValue));
        
        await interaction.respond(
            filtered.map((ban) => (
                {
                    name: ban.user.tag,
                    value: ban.user.id
                }
            )).slice(0, 25)
        );
    };
};