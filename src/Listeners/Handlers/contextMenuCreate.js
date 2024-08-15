const { ContextMenuInteraction } = require('discord.js');

const ContextMenu = require('../../Core/Structures/ContextMenu');
const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class ContextMenuCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'contextMenuCreate'
        });
    };

    /**
     * 
     * @param {ContextMenuInteraction} interaction 
     * @param {ContextMenu} contextmenu
     */
    
    async run (interaction, contextmenu) {
        try {
            await contextmenu.run(interaction);
        } catch(error) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Désolé, une erreur est survenue.')
                ],
                ephemeral: true
            });

            this.client.emit('interactionError', error);
        };
    };
};