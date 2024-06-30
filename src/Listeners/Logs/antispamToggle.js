const Event = require('../../Managers/Structures/Event');
const { ButtonInteraction } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class AntiSpamToggleEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'antispamToggle'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     * @param {Array[String]}
     */
    
    run (interaction, modules) {
        const state = modules.includes('antispam');

        if (modules.includes('logs') && interaction.guild.channels.resolve(interaction.guild.getData('logs.channel'))) {
            interaction.guild.channels.resolve(interaction.guild.getData('logs.channel')).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-spam')
                    .setDescription(
                        `Le système d'anti-spam vient d'être ${state ? 'désactivé' : 'activé'}.\n` +
                        `> **Status:** ${state ? `Désactivé ${this.client.config.emojis.no}` : `Activé ${this.client.config.emojis.yes}`}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};