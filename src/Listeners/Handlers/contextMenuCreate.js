const { ContextMenuInteraction } = require('discord.js');

const ContextMenu = require('../../Managers/Structures/ContextMenu');
const MessageEmbed = require('../../Managers/MessageEmbed');
const Event = require('../../Managers/Structures/Event');

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
    
    run (interaction, contextmenu) {
        try {
            contextmenu.run(interaction);
        } catch(error) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Désolé, une erreur est survenue.')
                ],
                ephemeral: true
            });

            this.client.emit('contextMenuError', interaction, error);
        };
    };
};