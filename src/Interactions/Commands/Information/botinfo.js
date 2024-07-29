const Command = require('../../../Managers/Structures/Command');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { CommandInteraction, version, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');
const os = require('os');

module.exports = class BotInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'botinfo',
            description: 'Obtenir mes informations.',
            category: 'information'
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    run (interaction) {
        const users = this.client.utils.allUsers;
        const creationTimestamp = parseInt(this.client.user.createdTimestamp / 1000);
        const uptimeTimestamp = parseInt((Date.now() - this.client.uptime) / 1000);
        const linesOfCode = this.client.utils.countLinesInDir('./', ['.js'], ['node_modules']);

        const banner = new AttachmentBuilder('./src/Images/Blurple White Banner.png')
        .setName('banner.png');

        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle(this.client.config.username)
                .setDescription(
                    `> **Utilisateur:** ${this.client.user}\n` +
                    `> **Nom d'utilisateur:** ${this.client.user.tag}\n` +
                    `> **Identifiant:** ${this.client.user.id}\n\n` +
                    
                    `> **Développeur${this.client.config.utils.devs.length > 1 ? 's' : ''}:** ${this.client.utils.joinCustomLastWord(this.client.config.utils.devs.map((dev) => this.client.users.resolve(dev) || 'Utilisateur introuvable'))}\n` +
                    `> **Version:** ${this.client.config.utils.version}\n` +
                    `> **Serveur${this.client.guilds.cache.size > 1 ? 's' : ''}:** ${this.client.guilds.cache.size.toLocaleString()} serveur${this.client.guilds.cache.size > 1 ? 's' : ''}\n` +
                    `> **Utilisateur${users > 1 ? 's' : ''}:** ${users.toLocaleString()} utilisateur${users > 1 ? 's' : ''}\n` +
                    `> **Commande${this.client.commands.size > 1 ? 's' : ''}:** ${this.client.commands.size.toLocaleString()} commande${this.client.commands.size > 1 ? 's' : ''}\n` +
                    `> **Date de création:** <t:${creationTimestamp}:D> à <t:${creationTimestamp}:T> (<t:${creationTimestamp}:R>)\n` +
                    `> **Ping:** ${this.client.ws.ping === -1 ? 'Latence indisponible...' : `${this.client.ws.ping}ms`}\n` +
                    `> **Date de connexion:** <t:${uptimeTimestamp}:D> à <t:${uptimeTimestamp}:T> (<t:${uptimeTimestamp}:R>)\n\n` +

                    `> **Processeur:** \`${os.cpus()[0].model} x${os.cpus().length}\`\n` +
                    `> **RAM:** ${this.client.utils.formatBytes(os.totalmem() - os.freemem())}\n` +
                    `> **OS:** ${os.type()} ${os.release()}\n` +
                    `> **Node.JS:** ${process.version.replace('v', '')}\n` +
                    `> **Discord.JS:** ${version}\n` +
                    `> **Lignes de code:** ${linesOfCode.toLocaleString()} ligne${linesOfCode > 1 ? 's' : ''}`
                )
                .setImage('attachment://banner.png')
                .setThumbnail(this.client.user.displayAvatarURL({ size: 4096 }))
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
                )
            ],
            files: [ banner ]
        });
    };
};