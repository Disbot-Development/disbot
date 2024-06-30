const Event = require('../../Managers/Structures/Event');
const { GuildMember, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ButtonStyle } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { CaptchaGenerator } = require('captcha-canvas');

module.exports = class GuildMemberAddEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'guildMemberAdd'
        });
    };

    /**
     * 
     * @param {GuildMember} member
      */


    async run (member) {
        if (member.user.bot) return;
        
        const modules = member.guild.getModules();
        const captchaRole = member.guild.roles.resolve(member.guild.getData('captcha.roles.before'));
        const captchaChannel = member.guild.channels.resolve(member.guild.getData('captcha.channel'));

        if (modules.includes('captcha') && captchaRole && captchaChannel) {
            member.roles.add(captchaRole)
            .catch(() => 0);

            const code = this.client.utils.generateRandomChars(4).toUpperCase();

            member.setData('captcha.code', code);
            member.setData('captcha.date', new Date().addMinutes(5).getTime());

            const captcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({ text: code, size: 60, color: '#5865f2' })
            .setDecoy({ opacity: 0.5 })
            .setTrace({ color: '#5865f2' });

            const buffer = await captcha.generate();

            const image = new AttachmentBuilder(buffer)
            .setName('captcha.png');

            const message = await captchaChannel.send({
                content: `${member}`,
                embeds: [
                    new MessageEmbed()
                    .setTitle('Captcha')
                    .setDescription(
                        `Afin d\'obtenir l\'accès au reste du serveur, résolvez le captcha.\n` +
                        `> - Vous disposez de 5 minutes afin de résoudre le captcha. Si vous ne résolvez pas le captcha dans le temps imparti, vous serez exclu du serveur.`
                    )
                    .setImage('attachment://captcha.png')
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('captcha-resolve')
                        .setLabel('Résoudre')
                        .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                        .setCustomId('captcha-regenerate')
                        .setLabel('Regénérer')
                        .setStyle(ButtonStyle.Secondary)
                    )
                ],
                files: [
                    image
                ]
            });

            member.setData('captcha.message', message.id);
        };
    };
};