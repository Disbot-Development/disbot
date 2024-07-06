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
     */
    
    async run (interaction) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];

        const state = modules.includes('captcha');

        if (modules.includes('logs') && interaction.guild.channels.resolve(await this.client.database.get(`${interaction.guild.id}.logs.channel`))) {
            interaction.guild.channels.resolve(await this.client.database.get(`${interaction.guild.id}.logs.channel`)).send({
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