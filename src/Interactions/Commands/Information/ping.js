const { CommandInteraction } = require('discord.js');

const Command = require('../../../Managers/Structures/Command');
const MessageEmbed = require('../../../Managers/MessageEmbed');

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
        const start = performance.now();
        await this.client.database.get('');
        const end = performance.now();
        
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setTitle('Latence')
                .setDescription(
                    `> **Discord:** ${this.client.ws.ping === -1 ? 'Latence indisponible...' : `${this.client.ws.ping}ms`}\n` +
                    `> **Base de données:** ${Math.round(end - start)}ms`
                )
            ]
        });
    };
};