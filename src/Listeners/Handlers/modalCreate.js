const { ModalSubmitInteraction } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');
const Modal = require('../../Core/Structures/Modal');

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

    async run (interaction, modal) {
        try {
            await modal.run(interaction);
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