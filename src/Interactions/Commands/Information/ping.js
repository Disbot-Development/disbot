const Command = require('../../../Managers/Structures/Command');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { CommandInteraction } = require('discord.js');

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            description: 'Obtenir ma latence.',
            category: 'information'
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async run (interaction) {
        await interaction.deferReply();

        const reply = await interaction.fetchReply();
        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply({
            embeds: [
                new MessageEmbed()
                .setTitle('Latence')
                .setDescription(
                    `> **Ping:** ${ping}ms\n` +
                    `> **WebSocket:** ${this.client.ws.ping === -1 ? 'Calcul en cours...' : `${this.client.ws.ping}ms`}`
                )
            ]
        });
    };
};