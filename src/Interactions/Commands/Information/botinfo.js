const Command = require('../../../Managers/Structures/Command');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { CommandInteraction, version, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Disbot')
                .setDescription(
                    `> **Utilisateur:** ${this.client.user}\n` +
                    `> **Nom d'utilisateur:** ${this.client.user.tag}\n` +
                    `> **Identifiant:** ${this.client.user.id}\n\n` +
                    
                    `> **Développeur${this.client.config.utils.devs.length > 1 ? 's' : ''}:** ${this.client.config.utils.devs.map((dev) => this.client.users.resolve(dev) || 'Utilisateur introuvable').join(', ')}\n` +
                    `> **Version:** ${this.client.config.utils.version}\n` +
                    `> **Serveur${this.client.guilds.cache.size > 1 ? 's' : ''}:** ${this.client.guilds.cache.size.toLocaleString()}\n` +
                    `> **Utilisateur${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0) > 1 ? 's' : ''}:** ${this.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}\n` +
                    `> **Commande${this.client.commands.size > 1 ? 's' : ''}:** ${this.client.commands.size.toLocaleString()}\n` +
                    `> **Date de création:** <t:${parseInt(this.client.user.createdTimestamp / 1000)}:f>\n` +
                    `> **Ping:** ${this.client.ws.ping === -1 ? 'Latence indisponible...' : `${this.client.ws.ping}ms`}\n` +
                    `> **Temps en ligne:** <t:${parseInt((Date.now() - this.client.uptime) / 1000)}:R>\n\n` +

                    `> **Processeur:** \`${os.cpus()[0].model} x${os.cpus().length}\`\n` +
                    `> **RAM:** ${this.client.utils.formatBytes(os.totalmem() - os.freemem())} / ${this.client.utils.formatBytes(os.totalmem())}\n` +
                    `> **OS:** ${os.type()} ${os.release()}\n` +
                    `> **Node.JS:** ${process.version.replace('v', '')}\n` +
                    `> **Discord.JS:** ${version}`
                )
                .setImage(this.client.config.images.banner)
                .setThumbnail(this.client.user.displayAvatarURL({ size: 4096, dynamic: true }))
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(this.client.config.links.support)
                    .setEmoji(this.client.config.emojis.support)
                    .setLabel('Support'),
                    new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setURL(this.client.config.links.invite)
                    .setEmoji(this.client.config.emojis.bot)
                    .setLabel('Inviter')
                )
            ]
        });
    };
};