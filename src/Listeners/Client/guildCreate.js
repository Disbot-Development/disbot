const Event = require('../../Managers/Structures/Event');
const { Guild, ActionRowBuilder, ButtonBuilder, ButtonStyle, AuditLogEvent } = require('discord.js');
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
        const audit = (await guild.fetchAuditLogs({
            type: AuditLogEvent.BotAdd
        }))?.entries?.first();

        const inviter = audit?.executor && audit?.target === this.client.user.id ? audit.executor : await guild.fetchOwner();
        
        inviter.send({
            embeds: [
                new MessageEmbed()
                .setTitle(`${this.client.config.emojis.heart} Merci de m\'avoir ajouté à votre serveur !`)
                .setDescription(
                    `${this.client.config.emojis.help} Disbot est un projet de bot Discord dirigé par une équipe francophone dédié à la sécurité des serveurs. Je fonctionne en commandes slash ! Utilise la commande </help:${(await this.client.application.commands.fetch()).filter((cmd) => cmd.name === 'help').first().id}> afin de voir la liste de mes commandes !\n\n` +

                    `${this.client.config.emojis.mod} Voici la liste des commandes utiles à la protection de votre serveur:\n` +
                    `> - </logs:1256320446832316448>: Répertorier les actions importantes que j'ai réalisé sur le serveur.\n` +
                    `> - </captcha:1254975453136162884>: Faire remplir un formulaire avec un code à déchiffrer à tous les nouveaux membres qui rejoindront le serveur.\n` +
                    `> - </antispam:1256351694179143731>: Bloquer les utilisateurs qui tentent d'envoyer des messages trop rapidement.`
                )
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setEmoji(this.client.config.emojis.bot)
                    .setLabel('Invite')
                    .setStyle(ButtonStyle.Link)
                    .setURL(this.client.config.links.invite),
                    new ButtonBuilder()
                    .setEmoji(this.client.config.emojis.support)
                    .setLabel('Support')
                    .setStyle(ButtonStyle.Link)
                    .setURL(this.client.config.links.support)
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