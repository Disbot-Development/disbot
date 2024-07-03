const SelectMenu = require('../../../Managers/Structures/SelectMenu');
const { StringSelectMenuInteraction } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class PasswordSelectMenu extends SelectMenu {
    constructor(client) {
        super(client, {
            name: 'password'
        });
    };

    /**
     * 
     * @param {StringSelectMenuInteraction} interaction 
     */
    
    run (interaction) {

        switch (interaction.values[0]) {
            case '🔠':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars({ length: 16, uppercase: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
            case '🔡':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars({ length: 16, lowercase: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
            case '🔢':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars({ length: 16, numbers: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
            case '1️⃣':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars({ length: 16, uppercase: true, lowercase: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
            case '2️⃣':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars({ length: 16, uppercase: true, lowercase: true, numbers: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
            case '3️⃣':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
        };
    };
};