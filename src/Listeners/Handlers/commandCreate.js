const Event = require('../../Managers/Structures/Event');
const Command = require('../../Managers/Structures/Command');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { CommandInteraction } = require('discord.js');

module.exports = class CommandCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'commandCreate'
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Command} command
     */
    
    run (interaction, command) {
        try {
            command.run(interaction);
        } catch(error) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Désolé, une erreur est survenue.')
                ],
                ephemeral: true
            });

            this.client.emit('commandError', interaction, error);
        };
    };
};