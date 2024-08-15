const { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder, WebhookClient } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class MessageCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'messageCreate'
        });
    };

    /**
     * 
     * @param {Message} message
     */


    async run (message) {
        if (!message.guild || message.author.bot) return;

        const strip = new AttachmentBuilder('./assets/imgs/Little Banner.png')
        .setName('strip.png');

        if (message.mentions.has(this.client.user, { ignoreEveryone: true, ignoreRepliedUser: true, ignoreRoles: true })) message.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Vous m\'avez mentionné ?')
                .setDescription(
                    `${this.client.config.emojis.help} ${this.client.config.username} est un projet de bot Discord dirigé par une équipe francophone dédié à la sécurité des serveurs. Je fonctionne en commandes slash !\n\n` +

                    `${this.client.config.emojis.bot} Utilise la commande ${this.client.getApplicationCommandString(await this.client.application.commands.fetch(), 'help')} afin de voir la liste de mes commandes !`
                )
                .setImage('attachment://strip.png')
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
            files: [strip]
        });
        
        const modules = await this.client.database.get(`${message.guild.id}.modules`) || [];

        if (modules.includes('antilink') && !message.member.isAdmin() && !(await this.client.database.get(`${message.guild.id}.whitelist`) || []).includes(message.author.id)) {
            let linkMatch;
            let censoredContent;
            const tokenMatch = [].concat(message.content.match(this.client.config.antitoken.regex));

            switch (await this.client.database.get(`${message.guild.id}.antilink.type`)) {
                case 'discord':
                    linkMatch = [].concat(message.content.match(this.client.config.antilink.regex.discord));
                    censoredContent = message.content.slice(0, 2000).replace(this.client.config.antilink.regex.discord, this.client.config.antilink.replace);
                    
                    break;
                case 'all':
                    linkMatch = [].concat(message.content.match(this.client.config.antilink.regex.all), message.content.match(this.client.config.antilink.regex.discord));
                    censoredContent = message.content.slice(0, 2000).replace(this.client.config.antilink.regex.all, this.client.config.antilink.replace).replace(this.client.config.antilink.regex.discord, this.client.config.antilink.replace);
                    
                    break;
            };

            const filteredLinkMatch = linkMatch.filter((match) => match);
            const filteredTokenMatch = tokenMatch.filter((match) => match);

            if (filteredLinkMatch.length && !filteredTokenMatch.length) {
                message.delete()
                .catch(() => 0);

                const webhooks = await message.channel.fetchWebhooks();
                let myWebhook = webhooks.find((webhook) => webhook.owner.id === this.client.user.id);
                if (!myWebhook) myWebhook = await message.channel.createWebhook({
                    name: this.client.config.username,
                    avatar: this.client.user.displayAvatarURL({ size: 4096 }),
                    reason: 'Fonctionnalité du système d\'anti-link.'
                });

                const clientWebhook = new WebhookClient({ url: myWebhook.url });
                clientWebhook.send({
                    content: censoredContent,
                    username: message.author.username,
                    avatarURL: message.author.displayAvatarURL({ size: 4096 })
                });

                const duration = await this.client.database.get(`${message.guild.id}.antilink.duration`) || this.client.config.antilink.duration;
                if (duration) message.member.timeout(duration * 60 * 1000, 'A été détecté par le système d\'anti-link.')
                .then((member) => this.client.emit('antilinkDetected', message.guild, member, duration))
                .catch(() => 0);

                await this.client.database.add('count.antilink', 1);
            };
        };

        if (modules.includes('antitoken') && !message.member.isAdmin() && !(await this.client.database.get(`${message.guild.id}.whitelist`) || []).includes(message.author.id)) {
            const tokenMatch = [].concat(message.content.match(this.client.config.antitoken.regex));
            const filteredTokenMatch = tokenMatch.filter((match) => match);

            if (filteredTokenMatch.length) {
                message.delete()
                .catch(() => 0);

                const duration = await this.client.database.get(`${message.guild.id}.antitoken.duration`) || this.client.config.antitoken.duration;
                if (duration) message.member.timeout(duration * 60 * 1000, 'A été détecté par le système d\'anti-token.')
                .then((member) => this.client.emit('antitokenDetected', message.guild, member, duration))
                .catch(() => 0);

                await this.client.database.add('count.antitoken', 1);
            };
        };

        if (modules.includes('antispam') && !message.member.isAdmin() && !(await this.client.database.get(`${message.guild.id}.whitelist`) || []).includes(message.author.id)) {
            const limit = await this.client.database.get(`${message.guild.id}.antispam.limit`) || this.client.config.antispam.limit;
            
            const messages = await this.client.database.get(`${message.guild.id}.users.${message.author.id}.antispam.messages`) || [];
            const newMessages = messages.filter((msg) => Date.now() - msg < this.client.config.antispam.cooldown * 1000);

            await this.client.database.set(`${message.guild.id}.users.${message.author.id}.antispam.messages`, newMessages);

            if (newMessages.length >= limit) {
                await this.client.database.delete(`${message.guild.id}.users.${message.author.id}.antispam`);

                const duration = await this.client.database.get(`${message.guild.id}.antispam.duration`) || this.client.config.antispam.duration;
                if (duration) message.member.timeout(duration * 60 * 1000, 'A été détecté par le système d\'anti-spam.')
                .then((member) => this.client.emit('antispamDetected', message.guild, member, limit, duration))
                .catch(() => 0);

                const messagesArray = [...(await message.channel.messages.fetch()).filter((msg) => message.author.id === msg.author.id).values()].slice(0, 10);

                message.channel.bulkDelete(messagesArray);

                await this.client.database.add('count.antispam', 1);
            } else {
                await this.client.database.push(`${message.guild.id}.users.${message.author.id}.antispam.messages`, Date.now());
            };
        };
    };
};