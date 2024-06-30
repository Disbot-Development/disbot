const Event = require('../../Managers/Structures/Event');
const { ButtonInteraction } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class CaptchaToggleEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'captchaToggle'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     * @param {Array[String]}
     */
    
    run (interaction, modules) {
        const state = modules.includes('captcha');

        if (modules.includes('logs') && interaction.guild.channels.resolve(interaction.guild.getData('logs.channel'))) {
            interaction.guild.channels.resolve(interaction.guild.getData('logs.channel')).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Captcha')
                    .setDescription(
                        `Le système de captcha vient d'être ${state ? 'désactivé' : 'activé'}.\n` +
                        `> **Status:** ${state ? `Désactivé ${this.client.config.emojis.no}` : `Activé ${this.client.config.emojis.yes}`}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};