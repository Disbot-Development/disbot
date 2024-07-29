const Event = require('../../Managers/Structures/Event');
const { Guild, ActionRowBuilder, ButtonBuilder, ButtonStyle, AuditLogEvent, PermissionFlagsBits } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class GuildCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'guildCreate'
        });
    };

    /**
     * 
     * @param {Guild} guild
     */


    async run (guild) {
        if (guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) {
            const audit = (await guild.fetchAuditLogs({ type: AuditLogEvent.BotAdd })).entries.first();
            const inviter = audit.executor && audit.target === this.client.user.id ? audit.executor : await guild.fetchOwner();
            const applicationCommands = await this.client.application.commands.fetch();
    
            const logsCommand = applicationCommands.filter((cmd) => cmd.name === 'logs').first();
            const captchaCommand = applicationCommands.filter((cmd) => cmd.name === 'captcha').first();
            const antiraidCommand = applicationCommands.filter((cmd) => cmd.name === 'antiraid').first();
            
            inviter.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle(`${this.client.config.emojis.heart} Merci de m\'avoir ajouté à votre serveur !`)
                    .setDescription(
                        `${this.client.config.emojis.help} Disbot est un projet de bot Discord dirigé par une équipe francophone dédié à la sécurité des serveurs. Je fonctionne en commandes slash ! Utilise la commande </${applicationCommands.filter((cmd) => cmd.name === 'help').first().name}:${applicationCommands.filter((cmd) => cmd.name === 'help').first().id}> afin de voir la liste de mes commandes !\n\n` +
    
                        `${this.client.config.emojis.mod} Voici la liste des commandes utiles à la protection de votre serveur:\n` +
                        `> - </${logsCommand.name}:${logsCommand.id}>: Répertorier les actions importantes que j'ai réalisé sur le serveur.\n` +
                        `> - </${captchaCommand.name}:${captchaCommand.id}>: Faire remplir un formulaire avec un code à déchiffrer à tous les nouveaux membres qui rejoindront le serveur.\n` +
                        `> - </${antiraidCommand.name}:${antiraidCommand.id}>: Bloquer la venue de nouveaux membres sur le serveur si trop d'utilisateurs rejoignent en peu de temps.`
                    )
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(this.client.config.links.website)
                        .setEmoji(this.client.config.emojis.search)
                        .setLabel('Site'),
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(this.client.config.links.invite)
                        .setEmoji(this.client.config.emojis.bot)
                        .setLabel('Inviter'),
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(this.client.config.links.support)
                        .setEmoji(this.client.config.emojis.support)
                        .setLabel('Support')
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setLabel(`Envoyé depuis: ${guild.name}`)
                        .setCustomId('sent-from')
                        .setStyle(ButtonStyle.Secondary)
                        .setDisabled(true)
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};