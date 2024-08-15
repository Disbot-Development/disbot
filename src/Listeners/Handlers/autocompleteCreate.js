const { AutocompleteInteraction } = require('discord.js');

const Command = require('../../Core/Structures/Command');
const Event = require('../../Core/Structures/Event');

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

    async run (interaction, command) {
        try {
            await command.autocomplete(interaction);
        } catch(error) {
            this.client.emit('interactionError', error);
        };
    };
};