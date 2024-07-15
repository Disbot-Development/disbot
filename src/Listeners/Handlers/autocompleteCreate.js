const Event = require('../../Managers/Structures/Event');
const Command = require('../../Managers/Structures/Command');
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
            this.client.emit('autocompleteError', interaction, error);
        };
    };
};