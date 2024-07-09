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
        const guildEmojis = await interaction.guild.emojis.fetch();
        const guildBans = await interaction.guild.bans.fetch();

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
                    `> **Date de création:** <t:${parseInt(interaction.guild.createdTimestamp / 1000)}:f>\n\n` +

                    `> **Salon${interaction.guild.channels.cache.filter((channel) => channel.type !== ChannelType.GuildCategory).size > 1 ? 's' : ''} (${interaction.guild.channels.cache.filter((channel) => channel.type !== ChannelType.GuildCategory).size}):** ${interaction.guild.channels.cache.filter((channel) => channel.type !== ChannelType.GuildCategory).map((channel) => channel).slice(0, 10).join(', ') || this.client.config.emojis.no} ${interaction.guild.channels.cache.filter((channel) => channel.type !== 'GUILD_CATEGORY').size > 10 ? 'and more...' : ''}\n\n` +

                    `> **Rôle${interaction.guild.roles.cache.filter((role) => role.id !== interaction.guild.id).size > 1 ? 's' : ''} (${interaction.guild.roles.cache.filter((role) => role.id !== interaction.guild.id).size}):** ${interaction.guild.roles.cache.filter((role) => role.id !== interaction.guild.id).map((role) => role).slice(0, 10).join(', ') || this.client.config.emojis.no} ${interaction.guild.roles.cache.filter((role) => role.id !== interaction.guild.id).size > 10 ? 'and more...' : ''}\n\n` +
                    
                    `> **Émoji${guildEmojis.size > 1 ? 's' : ''} (${guildEmojis.size}):** ${guildEmojis.map((emoji) => emoji).slice(0, 20).join(', ') || this.client.config.emojis.no} ${guildEmojis.size > 10 ? 'and more...' : ''}\n\n` +

                    `> **Bannissement${guildBans.size > 1 ? 's' : ''} (${guildBans.size}):** ${guildBans.map((ban) => `\`${ban.user.username}\``).slice(0, 10).join(', ') || this.client.config.emojis.no} ${guildBans.size > 10 ? 'and more...' : ''}`
                )
                .setImage(interaction.guild.bannerURL() ? interaction.guild.bannerURL({ size: 4096 }) : null)
                .setThumbnail(interaction.guild.iconURL({ size: 4096 }))
            ]
        });
    };
};
