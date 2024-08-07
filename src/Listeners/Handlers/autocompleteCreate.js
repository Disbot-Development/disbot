const { AutocompleteInteraction } = require('discord.js');

const Command = require('../../Managers/Structures/Command');
const Event = require('../../Managers/Structures/Event');

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