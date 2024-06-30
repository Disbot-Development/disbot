const Event = require('../../Managers/Structures/Event');
const Button = require('../../Managers/Structures/Button');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { ButtonInteraction } = require('discord.js');

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

    run (interaction, button) {
        if ((interaction.message.interaction?.user?.id || interaction.user.id) !== interaction.user.id) return;

        try {
            button.run(interaction);
        } catch(error) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Désolé, une erreur est survenue.')
                ],
                ephemeral: true
            });

            this.client.emit('buttonError', interaction, error);
        };
    };
};