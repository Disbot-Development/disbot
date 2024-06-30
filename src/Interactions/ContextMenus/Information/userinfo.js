const ContextMenu = require('../../../Managers/Structures/ContextMenu');
const { ContextMenuCommandInteraction, ApplicationCommandType, ActivityType } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class UserInfoContextMenu extends ContextMenu {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            type: ApplicationCommandType.User
        });
    };

    /**
     * 
     * @param {ContextMenuCommandInteraction} interaction 
     */
    
    async run (interaction) {
        const member = interaction.guild.members.resolve(interaction.targetId);

        const fetchedUser = await this.client.users.fetch(member.user.id, { force: true });
        const banner = fetchedUser ? fetchedUser.bannerURL() ? fetchedUser.bannerURL({ size: 4096 }) : null : null;

        const userFlags = member.user.flags.toArray();

        const status = member.presence?.status
        .replace('online', `${this.client.config.emojis.online} En ligne`)
        .replace('idle', `${this.client.config.emojis.idle} Absent`)
        .replace('dnd', `${this.client.config.emojis.dnd} Ne pas déranger`)
        .replace('offline', `${this.client.config.emojis.offline} Hors ligne`)
        || `${this.client.config.emojis.offline} Hors ligne`;

        const customStatus = member.presence?.activities?.find((activity) => activity.type === ActivityType.Custom);

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Informations de l\'utilisateur')
                .setDescription(
                    `> **Utilisateur:** ${member.user}\n` +
                    `> **Nom d'utilisateur:** ${member.user.tag}\n` +
                    `> **Surnom:** ${member.nickname ? member.nickname : this.client.config.emojis.no}\n` +
                    `> **Identifiant:** ${member.user.id}\n\n` +

                    `> **Status personnalisé:** ${customStatus?.state ? `\`${customStatus?.state}` : this.client.config.emojis.no}\`\n` +
                    `> **Vocal:** ${member.voice.channel || this.client.config.emojis.no}\n\n` +

                    `> **Robot:** ${member.user.bot ? this.client.config.emojis.yes : this.client.config.emojis.no}\n` +
                    `> **Administrateur:** ${member.isAdmin() ? this.client.config.emojis.yes : this.client.config.emojis.no}\n` +
                    `> **Badge${userFlags.length > 1 ? 's' : ''}:** ${userFlags.length.toLocaleString('en-US') || this.client.config.emojis.no}\n` +
                    `> **Status:** ${status}\n` +
                    `> **Date de création:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:f>\n` +
                    `> **A rejoint le serveur:** <t:${Math.floor(member.joinedTimestamp / 1000)}:f>\n` +
                    `> **Avertissement${(member.getData('warns') || 0) > 1 ? 's' : ''}:** ${(member.getData('warns') || 0).toLocaleString('en-US')}\n` +
                    `> **Message${(member.getData('messages') || 0) > 1 ? 's' : ''}:** ${member.getData('messages') || 0}`
                )
                .setThumbnail(member.user.displayAvatarURL({ size: 4096, dynamic: true }))
                .setImage(banner ? banner : this.client.config.images.error)
            ],
            ephemeral: true
        });
    };
};