const Command = require('../../../Managers/Structures/Command');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { CommandInteraction, ChannelType } = require('discord.js');

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
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Informations du serveur')
                .setDescription(
                    `> **Fondateur:** ${await interaction.guild.fetchOwner()}\n` +
                    `> **Nom d'utilisateur:** ${interaction.guild.name}\n` +
                    `> **Identifiant:** ${interaction.guild.id}\n\n` +

                    `> **Membre${interaction.guild.memberCount > 1 ? 's' : ''}:** ${interaction.guild.memberCount}\n` +
                    `> **Dans un salon vocal:** ${interaction.guild.members.cache.filter(m => m.voice.channel).size}\n` +
                    `> **Administrateur${interaction.guild.members.cache.filter((member) => member.isAdmin()).size > 1 ? 's' : ''}:** ${interaction.guild.members.cache.filter((member) => member.isAdmin()).size}\n` +
                    `> **Robot${interaction.guild.members.cache.filter((member) => member.user.bot).size > 1 ? 's' : ''}:** ${interaction.guild.members.cache.filter((member) => member.user.bot).size}\n` +
                    `> **Boosts:** ${interaction.guild.premiumSubscriptionCount || this.client.config.emojis.no}\n` +
                    `> **Partenaire:** ${interaction.guild.partnered ? this.client.config.emojis.yes : this.client.config.emojis.no}\n` +
                    `> **Date de création:** <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:f>\n` +
                    `> **Message${(interaction.guild.getData('messages') || 0) || 1 ? 's' : ''}:** ${interaction.guild.getData('messages') || 0}\n\n` +

                    `> **Salon${interaction.guild.channels.cache.filter((channel) => channel.type !== ChannelType.GuildCategory).size > 1 ? 's' : ''} (${interaction.guild.channels.cache.filter((channel) => channel.type !== ChannelType.GuildCategory).size}):** ${interaction.guild.channels.cache.filter((channel) => channel.type !== ChannelType.GuildCategory).map((channel) => channel).slice(0, 10).join(', ') || this.client.config.emojis.no} ${interaction.guild.channels.cache.filter((channel) => channel.type !== 'GUILD_CATEGORY').size > 10 ? 'and more...' : ''}\n\n` +

                    `> **Rôle${interaction.guild.roles.cache.filter((role) => role.id !== interaction.guild.id).size > 1 ? 's' : ''} (${interaction.guild.roles.cache.filter((role) => role.id !== interaction.guild.id).size}):** ${interaction.guild.roles.cache.filter((role) => role.id !== interaction.guild.id).map((role) => role).slice(0, 10).join(', ') || this.client.config.emojis.no} ${interaction.guild.roles.cache.filter((role) => role.id !== interaction.guild.id).size > 10 ? 'and more...' : ''}\n\n` +
                    
                    `> **Émoji${(await interaction.guild.emojis.fetch()).size > 1 ? 's' : ''} (${(await interaction.guild.emojis.fetch()).size}):** ${(await interaction.guild.emojis.fetch()).map((emoji) => emoji).slice(0, 20).join(', ') || this.client.config.emojis.no} ${(await interaction.guild.emojis.fetch()).size > 10 ? 'and more...' : ''}\n\n` +

                    `> **Bannissement${(await interaction.guild.bans.fetch()).size > 1 ? 's' : ''} (${(await interaction.guild.bans.fetch()).size}):** ${(await interaction.guild.bans.fetch()).map((ban) => `\`${ban.user.username}\``).slice(0, 10).join(', ') || this.client.config.emojis.no} ${(await interaction.guild.bans.fetch()).size > 10 ? 'and more...' : ''}`
                )
                .setImage(interaction.guild.bannerURL() ? interaction.guild.bannerURL() : this.client.config.images.error)
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
            ]
        });
    };
};
