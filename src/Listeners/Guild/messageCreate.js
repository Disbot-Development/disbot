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
                    `${this.client.config.emojis.dev} Je fonctionne en commandes slash, écrivez </help:${(await this.client.application.commands.fetch()).filter((cmd) => cmd.name === 'help').first().id}> afin de les voir.`
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
        
        const modules = message.guild.getModules();

        if (modules.includes('antispam') && !message.member.isAdmin()) {
            const limit = message.guild.getData('antispam.limit') || this.client.config.antispam.limit;
            const duration = message.guild.getData('antispam.duration') || this.client.config.antispam.duration;
            
            const messages = message.member.getData('antispam.messages') || [];
            const newMessages = messages.filter((msg) => Date.now() - msg < this.client.config.antispam.timeout * 1000);

            message.member.setData('antispam.messages', newMessages);

            if (newMessages.length >= limit) {
                message.member.removeData('antispam');

                message.member.timeout(duration * 60 * 1000, 'A été détecté par le système d\'anti-spam.')
                .then((member) => this.client.emit('antispamDetected', message.guild, member, limit, duration))
                .catch(() => 0);

                const messagesArray = [...(await message.channel.messages.fetch()).filter((msg) => message.author.id === msg.author.id).values()].slice(0, 10);

                message.channel.bulkDelete(messagesArray);
            } else {
                message.member.pushData('antispam.messages', Date.now());
            };
        };

        // if (this.client.config.banwords.filter((word) => message.content.includes(word)).length) {
        //     message.delete();

        //     message.member.addData('warns', 1);

        //     this.client.emit('warnCreate', message);

        //     const warnMessage = await message.channel.send({
        //         content: `${message.author}`,
        //         embeds: [
        //             new MessageEmbed()
        //             .setTitle('Mauvais langage')
        //             .setDescription(
        //                 `Faites attention aux mots que vous utilisez !\n` +
        //                 `> - Votre comportement a été signalé.\n` +
        //                 `> - **Avertissement${(message.member.getData('warns') || 0) > 1 ? 's' : ''}:** ${(message.member.getData('warns') || 0).toLocaleString('en-US')}`
        //             )
        //         ]
        //     });

        //     setTimeout(() => {
        //         warnMessage.delete();
        //     }, 5000);
        // };

        message.guild.addData('messages', 1);
        message.member.addData('messages', 1);
    };
};