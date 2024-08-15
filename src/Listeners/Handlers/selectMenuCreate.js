const { SelectMenuInteraction } = require('discord.js');

const SelectMenu = require('../../Core/Structures/SelectMenu');
const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class SelectMenuCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'selectMenuCreate'
        });
    };

    /**
     * 
     * @param {SelectMenuInteraction} interaction 
     * @param {SelectMenu} selectmenu
     */

    async run (interaction, selectmenu) {
        if ((interaction.message.interaction?.user?.id || interaction.user.id) !== interaction.user.id) return;

        try {
            await selectmenu.run(interaction);
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