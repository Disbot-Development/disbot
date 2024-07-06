const Event = require('../../Managers/Structures/Event');
const { Message, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

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

        if (message.mentions.has(this.client.user, { ignoreEveryone: true, ignoreRepliedUser: true, ignoreRoles: true })) message.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Disbot')
                .setDescription(
                    `${this.client.config.emojis.at} Vous m\'avez mentionné ?\n` +
                    `${this.client.config.emojis.dev} Je fonctionne en commandes slash, écrivez </${(await this.client.application.commands.fetch()).filter((cmd) => cmd.name === 'help').first().name}:${(await this.client.application.commands.fetch()).filter((cmd) => cmd.name === 'help').first().id}> afin de les voir.`
                )
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
        
        const modules = await this.client.database.get(`${message.guild.id}.modules`) || [];

        if (modules.includes('antispam') && !message.member.isAdmin() && !(await this.client.database.get(`${message.guild.id}.whitelist`) || []).includes(message.author.id)) {
            const limit = await this.client.database.get(`${message.guild.id}.antispam.limit`) || this.client.config.antispam.limit;
            const duration = await this.client.database.get(`${message.guild.id}.antispam.duration`) || this.client.config.antispam.duration;
            
            const messages = await this.client.database.get(`${message.guild.id}.users.${message.author.id}.antispam.messages`) || [];
            const newMessages = messages.filter((msg) => Date.now() - msg < this.client.config.antispam.timeout * 1000);

            await this.client.database.set(`${message.guild.id}.users.${message.author.id}.antispam.messages`, newMessages);

            if (newMessages.length >= limit) {
                await this.client.database.remove(`${message.guild.id}.users.${message.author.id}.antispam`);

                message.member.timeout(duration * 60 * 1000, 'A été détecté par le système d\'anti-spam.')
                .then((member) => this.client.emit('antispamDetected', message.guild, member, limit, duration))
                .catch(() => 0);

                const messagesArray = [...(await message.channel.messages.fetch()).filter((msg) => message.author.id === msg.author.id).values()].slice(0, 10);

                message.channel.bulkDelete(messagesArray);
            } else {
                await this.client.database.push(`${message.guild.id}.users.${message.author.id}.antispam.messages`, Date.now());
            };
        };
    };
};