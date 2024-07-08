const Event = require('../../Managers/Structures/Event');
const Command = require('../../Managers/Structures/Command');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { AutocompleteInteraction } = require('discord.js');

module.exports = class AutoCompleteCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'autocompleteCreate'
        });
    };

    /**
     * 
     * @param {AutocompleteInteraction} interaction 
     * @param {Command} command
     */

    run (interaction, command) {
        try {
            command.autocomplete(interaction);
        } catch(error) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Désolé, une erreur est survenue.')
                ],
                ephemeral: true
            });

            this.client.emit('autocompleteError', interaction, error);
        };
    };
};