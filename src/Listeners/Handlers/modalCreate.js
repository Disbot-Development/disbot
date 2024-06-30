const Event = require('../../Managers/Structures/Event');
const Modal = require('../../Managers/Structures/Modal');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { ModalSubmitInteraction } = require('discord.js');

module.exports = class ModalCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'modalCreate'
        });
    };

    /**
     * 
     * @param {ModalSubmitInteraction} interaction 
     * @param {Modal} modal
     */

    run (interaction, modal) {
        try {
            modal.run(interaction);
        } catch(error) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Désolé, une erreur est survenue.')
                ],
                ephemeral: true
            });

            this.client.emit('modalError', interaction, error);
        };
    };
};