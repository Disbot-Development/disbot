const Button = require('../../../Managers/Structures/Button');
const { ButtonInteraction, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ButtonStyle } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { CaptchaGenerator } = require('captcha-canvas');

module.exports = class CaptchaRegenerateButton extends Button {
    constructor(client) {
        super(client, {
            name: 'captcha-regenerate'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        if (interaction.message.id !== await this.client.database.get(`${interaction.guild.id}.users.${interaction.user.id}.captcha.message`)) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('Vous ne pouvez pas regénérer le captcha d\'un autre utilisateur.')
            ],
            ephemeral: true
        });

        const code = this.client.utils.generateRandomChars(
            4,
            this.client.utils.CharSet.UpperCase | this.client.utils.CharSet.Numerical
        );

        await this.client.database.set(`${interaction.guild.id}.users.${interaction.user.id}.captcha.code`, code);

        const captcha = new CaptchaGenerator()
        .setDimension(150, 450)
        .setCaptcha({ text: code, size: 60, color: '#5865f2' })
        .setDecoy({ opacity: 0.5 })
        .setTrace({ color: '#5865f2' });

        const buffer = await captcha.generate();

        const image = new AttachmentBuilder(buffer)
        .setName('newcaptcha.png');

        interaction.message.edit({
            content: `${interaction.member}`,
            embeds: [
                new MessageEmbed()
                .setTitle('Captcha')
                .setDescription(
                    `Afin d\'obtenir l\'accès au reste du serveur, résolvez le captcha.\n` +
                    `> - Vous disposez de 5 minutes afin de résoudre le captcha. Si vous ne résolvez pas le captcha dans le temps imparti, vous serez exclu du serveur.`
                )
                .setImage('attachment://newcaptcha.png')
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
                    .setDisabled(true)
                )
            ],
            files: [
                image
            ]
        });

        interaction.deferUpdate();
    };
};