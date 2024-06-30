const Event = require('../../Managers/Structures/Event');
const SelectMenu = require('../../Managers/Structures/SelectMenu');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { SelectMenuInteraction } = require('discord.js');

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

    run (interaction, selectmenu) {
        if ((interaction.message.interaction?.user?.id || interaction.user.id) !== interaction.user.id) return;

        try {
            selectmenu.run(interaction);
        } catch(err) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Désolé, une erreur est survenue.')
                ],
                ephemeral: true
            });

            this.client.emit('selectMenuError', interaction, err);
        };
    };
};