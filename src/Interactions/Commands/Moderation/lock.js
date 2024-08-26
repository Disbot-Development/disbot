const { CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType, ChannelType } = require('discord.js');

const MessageEmbed = require('../../../Commons/MessageEmbed');
const Command = require('../../../Core/Structures/Command');

module.exports = class LockCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'lock',
            description: 'Permet de verrouiller / déverrouiller un salon.',
            category: 'moderation',
            perms: [PermissionFlagsBits.ManageRoles],
            meperms: [PermissionFlagsBits.ManageRoles],
            options: [
                {
                    name: 'channel',
                    description: 'Le salon que vous souhaitez verrouiller / déverrouiller.',
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText]
                }
            ]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async run (interaction) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const isLocked = channel.permissionOverwrites.resolve(interaction.guild.id)?.deny?.has(PermissionFlagsBits.SendMessages);

        await channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: isLocked });

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('SUCCESS')
                .setDescription(`Le salon ${channel} a été ${isLocked ? 'déverrouillé' : 'verrouillé'}.`)
            ],
            ephemeral: true
        });

        this.client.emit('channelLocked', interaction, channel, isLocked);
    };
};