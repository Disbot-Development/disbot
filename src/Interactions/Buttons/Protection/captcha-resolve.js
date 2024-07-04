const Button = require('../../../Managers/Structures/Button');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { ButtonInteraction, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

module.exports = class CaptchaResolveButton extends Button {
    constructor(client) {
        super(client, {
            name: 'captcha-resolve'
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
                .setDescription('Vous ne pouvez pas résoudre le captcha d\'un autre utilisateur.')
            ],
            ephemeral: true
        });
        
        interaction.showModal(
            new ModalBuilder()
            .setCustomId('captcha')
            .setTitle('Captcha')
            .addComponents(
                new ActionRowBuilder()
                .addComponents(
                    new TextInputBuilder()
                    .setCustomId('answer')
                    .setLabel('Résolvez le captcha')
                    .setPlaceholder('Exemple: F4Y9')
                    .setStyle(TextInputStyle.Short)
                    .setMinLength(4)
                    .setMaxLength(4)
                    .setRequired(true)
                )
            )
        );
    };
};