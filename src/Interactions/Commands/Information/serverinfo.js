const { CommandInteraction, ChannelType } = require('discord.js');

const Command = require('../../../Core/Structures/Command');
const MessageEmbed = require('../../../Commons/MessageEmbed');

module.exports = class ServerInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'serverinfo',
            description: 'Obtenir les informations du serveur.',
            category: 'information'
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async run (interaction) {
        await interaction.deferReply();

        const members = await interaction.guild.members.fetch();
        const vocal = members.filter((member) => member.voice.channel).size;
        const admins = members.filter((member) => member.isAdmin()).size;
        const bots = members.filter((member) => member.user.bot).size;
        const subscription = interaction.guild.premiumSubscriptionCount;
        const timestamp = parseInt(interaction.guild.createdTimestamp / 1000);
        const channels = (await interaction.guild.channels.fetch()).filter((channel) => channel.type !== ChannelType.GuildCategory);
        const roles = (await interaction.guild.roles.fetch()).filter((role) => role.id !== interaction.guild.id);
        const emojis = await interaction.guild.emojis.fetch();
        const bans = await interaction.guild.bans.fetch();

        await interaction.editReply({
            embeds: [
                new MessageEmbed()
                .setTitle('Informations du serveur')
                .setDescription(
                    `> **Fondateur:** ${await interaction.guild.fetchOwner()}\n` +
                    `> **Nom:** ${interaction.guild.name}\n` +
                    `> **Identifiant:** ${interaction.guild.id}\n\n` +

                    `> **Membre${members.size > 1 ? 's' : ''}:** ${members.size} membre${members.size > 1 ? 's' : ''}\n` +
                    `> **Dans un salon vocal:** ${vocal} membre${vocal > 1 ? 's' : ''}\n` +
                    `> **Administrateur${admins > 1 ? 's' : ''}:** ${admins} membre${admins ? 's' : ''}\n` +
                    `> **Robot${bots > 1 ? 's' : ''}:** ${bots} robot${bots > 1 ? 's' : ''}\n` +
                    `> **Boost${subscription > 1 ? 's' : ''}:** ${(subscription || 0)} boost${subscription > 1 ? 's' : ''}\n\n` +
                    
                    `> **Date de création:** <t:${timestamp}:D> à <t:${timestamp}:T> (<t:${timestamp}:R>)\n\n` +

                    `> **Salon${channels.size > 1 ? 's' : ''} (${channels.size}):** ${channels.map((channel) => channel).slice(0, 10).join(', ')} ${channels.size > 10 ? 'et plus...' : ''}\n\n` +

                    `> **Rôle${roles.size > 1 ? 's' : ''} (${roles.size}):** ${roles.map((role) => role).slice(0, 10).join(', ') || this.client.config.emojis.no} ${roles.size > 10 ? 'et plus...' : ''}\n\n` +
                    
                    `> **Émoji${emojis.size > 1 ? 's' : ''} (${emojis.size}):** ${emojis.map((emoji) => emoji).slice(0, 20).join(', ') || this.client.config.emojis.no} ${emojis.size > 10 ? 'et plus...' : ''}\n\n` +

                    `> **Bannissement${bans.size > 1 ? 's' : ''} (${bans.size}):** ${bans.map((ban) => `\`${ban.user.username}\``).slice(0, 10).join(', ') || this.client.config.emojis.no} ${bans.size > 10 ? 'et plus...' : ''}`
                )
                .setImage(interaction.guild.bannerURL({ size: 4096 }))
                .setThumbnail(interaction.guild.iconURL({ size: 4096 }))
            ]
        });
    };
};
