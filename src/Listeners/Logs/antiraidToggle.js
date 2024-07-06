const Event = require('../../Managers/Structures/Event');
const { ButtonInteraction } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');

module.exports = class AntiRaidToggleEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'antiraidToggle'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */
    
    async run (interaction) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];

        const state = modules.includes('antiraid');

        if (modules.includes('logs') && interaction.guild.channels.resolve(await this.client.database.get(`${interaction.guild.id}.logs.channel`))) {
            interaction.guild.channels.resolve(await this.client.database.get(`${interaction.guild.id}.logs.channel`)).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-raid')
                    .setDescription(
                        `Le système d'anti-raid vient d'être ${state ? 'désactivé' : 'activé'}.\n` +
                        `> **Status:** ${state ? `Désactivé ${this.client.config.emojis.no}` : `Activé ${this.client.config.emojis.yes}`}`
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};