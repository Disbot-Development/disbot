const { ButtonInteraction } = require('discord.js');

const MessageEmbed = require('../../Commons/MessageEmbed');
const Button = require('../../Core/Structures/Button');
const Event = require('../../Core/Structures/Event');

module.exports = class ButtonCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'buttonCreate'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Button} button
     */

    async run (interaction, button) {
        if ((interaction.message.interaction?.user?.id || interaction.user.id) !== interaction.user.id) return;

        try {
            await button.run(interaction);
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