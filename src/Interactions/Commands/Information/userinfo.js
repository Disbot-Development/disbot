const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, ApplicationCommandOptionType, ActivityType } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class UserInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            description: 'Obtenir les informations d\'un utilisateur.',
            category: 'information',
            options: [
                {
                    name: 'user',
                    description: 'L\'utilisateur dont vous souhaitez obtenir les informations.',
                    type: ApplicationCommandOptionType.User
                }
            ]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction
     */

    async run(interaction) {
        const member = interaction.options.getMember('user') || interaction.member;
        const fetchedUser = await this.client.users.fetch(member.user.id, { force: true });
        const createdTimestamp = parseInt(member.user.createdTimestamp / 1000);
        const joinedTimestamp = parseInt(member.joinedTimestamp / 1000);

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
                    `> **Date de création:** <t:${createdTimestamp}:D> à <t:${createdTimestamp}:T> (<t:${createdTimestamp}:R>)\n` +
                    `> **A rejoint le serveur:** <t:${joinedTimestamp}:D> à <t:${joinedTimestamp}:T> (<t:${joinedTimestamp}:R>)`
                )
                .setThumbnail(member.user.displayAvatarURL({ size: 4096 }))
                .setImage(fetchedUser ? fetchedUser.bannerURL({ size: 4096 }) : null)
            ]
        });
    };
};