const { ButtonInteraction } = require('discord.js');

const Button = require('../../Core/Structures/Button');

module.exports = class RoleIgnoreButton extends Button {
    constructor(client) {
        super(client, {
            name: 'role-ignore'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    run (interaction) {
        this.client.database.push(`${interaction.guild.id}.ignored`, 'role');

        interaction.message.delete();
    };
};