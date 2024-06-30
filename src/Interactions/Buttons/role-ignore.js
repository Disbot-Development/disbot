const Button = require('../../Managers/Structures/Button');
const { ButtonInteraction } = require('discord.js');

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
        interaction.guild.pushData('ignored', 'role');

        interaction.message.delete();
    };
};