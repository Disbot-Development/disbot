const Modal = require('../../../Managers/Structures/Modal');
const { ModalSubmitInteraction, PermissionFlagsBits } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class CaptchaModal extends Modal {
    constructor(client) {
        super(client, {
            name: 'captcha',
            meperms: [PermissionFlagsBits.ManageRoles]
        });
    };

    /**
     * 
     * @param {ModalSubmitInteraction} interaction
     */

    async run (interaction) {
        const code = interaction.member.getData('captcha.code');

        if (interaction.fields.getTextInputValue('answer') !== code) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('Vous n\'avez pas résolu le captcha, recommencez.')
            ],
            ephemeral: true
        });

        interaction.member.removeData('captcha');

        const captchaBeforeRole = interaction.guild.roles.resolve(interaction.guild.getData('captcha.roles.before'));
        const captchaAfterRole = interaction.guild.roles.resolve(interaction.guild.getData('captcha.roles.after'));

        await interaction.member.roles.remove(captchaBeforeRole)
        .catch(() => 0);

        await interaction.member.roles.add(captchaAfterRole)
        .catch(() => 0);

        interaction.message.delete()
        .catch(() => 0);

        interaction.deferUpdate();

        this.client.emit('captchaSolved', interaction, code);
    };
};