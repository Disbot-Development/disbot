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
        const members = await interaction.guild.members.fetch();
        const inVocal = members.filter(m => m.voice.channel).size;
        const admins = members.filter((member) => member.isAdmin()).size;
        const bots = members.filter((member) => member.user.bot).size;
        const creationTimestamp = parseInt(interaction.guild.createdTimestamp / 1000);
        const channels = interaction.guild.channels.cache.filter((channel) => channel.type !== ChannelType.GuildCategory);
        const roles = interaction.guild.roles.cache.filter((role) => role.id !== interaction.guild.id);
        const guildEmojis = await interaction.guild.emojis.fetch();
        const guildBans = await interaction.guild.bans.fetch();

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Informations du serveur')
                .setDescription(
                    `> **Fondateur:** ${await interaction.guild.fetchOwner()}\n` +
                    `> **Nom:** ${interaction.guild.name}\n` +
                    `> **Identifiant:** ${interaction.guild.id}\n\n` +

                    `> **Membre${interaction.guild.memberCount > 1 ? 's' : ''}:** ${interaction.guild.memberCount} membre${interaction.guild.memberCount > 1 ? 's' : ''}\n` +
                    `> **Dans un salon vocal:** ${inVocal} membre${inVocal > 1 ? 's' : ''}\n` +
                    `> **Administrateur${admins > 1 ? 's' : ''}:** ${admins} membre${admins ? 's' : ''}\n` +
                    `> **Robot${bots > 1 ? 's' : ''}:** ${bots} robot${bots > 1 ? 's' : ''}\n` +
                    `> **Boost${interaction.guild.premiumSubscriptionCount > 1 ? 's' : ''}:** ${(interaction.guild.premiumSubscriptionCount || 0)} boost${interaction.guild.premiumSubscriptionCount > 1 ? 's' : ''}\n` +
                    `> **Partenaire:** ${interaction.guild.partnered ? this.client.config.emojis.yes : this.client.config.emojis.no}\n` +
                    `> **Date de création:** <t:${creationTimestamp}:D> à <t:${creationTimestamp}:T> (<t:${creationTimestamp}:R>)\n\n` +

                    `> **Salon${channels.size > 1 ? 's' : ''} (${channels.size}):** ${channels.map((channel) => channel).slice(0, 10).join(', ')} ${channels.size > 10 ? 'et plus...' : ''}\n\n` +

                    `> **Rôle${roles.size > 1 ? 's' : ''} (${roles.size}):** ${roles.map((role) => role).slice(0, 10).join(', ') || this.client.config.emojis.no} ${roles.size > 10 ? 'et plus...' : ''}\n\n` +
                    
                    `> **Émoji${guildEmojis.size > 1 ? 's' : ''} (${guildEmojis.size}):** ${guildEmojis.map((emoji) => emoji).slice(0, 20).join(', ') || this.client.config.emojis.no} ${guildEmojis.size > 10 ? 'et plus...' : ''}\n\n` +

                    `> **Bannissement${guildBans.size > 1 ? 's' : ''} (${guildBans.size}):** ${guildBans.map((ban) => `\`${ban.user.username}\``).slice(0, 10).join(', ') || this.client.config.emojis.no} ${guildBans.size > 10 ? 'et plus...' : ''}`
                )
                .setImage(interaction.guild.bannerURL({ size: 4096 }))
                .setThumbnail(interaction.guild.iconURL({ size: 4096 }))
            ]
        });
    };
};
