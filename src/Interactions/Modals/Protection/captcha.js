const { ModalSubmitInteraction, PermissionFlagsBits } = require('discord.js');

const MessageEmbed = require('../../../Managers/MessageEmbed');
const Modal = require('../../../Managers/Structures/Modal');

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
        const code = await this.client.database.get(`${interaction.guild.id}.users.${interaction.user.id}.captcha.code`);

        if (interaction.fields.getTextInputValue('answer') !== code) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Vous n\'avez pas résolu le captcha, recommencez.')
                ],
                ephemeral: true
            });

            return await this.client.database.add('count.captcha.failed', 1);
        };

        const captchaBeforeRole = interaction.guild.roles.resolve(await this.client.database.get(`${interaction.guild.id}.captcha.roles.before`));
        const captchaAfterRole = (await this.client.database.get(`${interaction.guild.id}.captcha.roles.after`) || []).map((role) => interaction.guild.roles.resolve(role));

        await interaction.member.roles.remove(captchaBeforeRole)
        .catch(() => 0);

        await interaction.member.roles.add(captchaAfterRole)
        .catch(() => 0);

        interaction.message.delete()
        .catch(() => 0);

        interaction.deferUpdate();

        this.client.emit('captchaSolved', interaction, code);

        await this.client.database.add('count.captcha.resolved', 1);
    };
};