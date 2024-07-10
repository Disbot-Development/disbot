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

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Informations de l\'utilisateur')
                .setDescription(
                    `> **Utilisateur:** ${member.user}\n` +
                    `> **Nom d'utilisateur:** ${member.user.tag}\n` +
                    `> **Identifiant:** ${member.user.id}\n\n` +

                    `> **Robot:** ${member.user.bot ? this.client.config.emojis.yes : this.client.config.emojis.no}\n` +
                    `> **Administrateur:** ${member.isAdmin() ? this.client.config.emojis.yes : this.client.config.emojis.no}\n` +
                    `> **Date de création:** <t:${Math.floor(member.user.createdTimestamp / 1000)}:f>\n` +
                    `> **A rejoint le serveur:** <t:${Math.floor(member.joinedTimestamp / 1000)}:f>`
                )
                .setThumbnail(member.user.displayAvatarURL({ size: 4096 }))
                .setImage(fetchedUser ? fetchedUser.bannerURL() ? fetchedUser.bannerURL({ size: 4096 }) : null : null)
            ],
            ephemeral: true
        });
    };
};