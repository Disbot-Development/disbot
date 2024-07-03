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

    run (interaction) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Latence')
                .setDescription(
                    `> **Ping:** ${this.client.ws.ping === -1 ? 'Latence indisponible...' : `${this.client.ws.ping}ms`}`
                )
            ]
        });
    };
};