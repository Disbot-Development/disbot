const { StringSelectMenuInteraction } = require('discord.js');

const SelectMenu = require('../../../Core/Structures/SelectMenu');
const MessageEmbed = require('../../../Commons/MessageEmbed');

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
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars(
                            16,
                            this.client.utils.CharSet.UpperCase
                        )}||`)
                    ],
                    ephemeral: true
                });

                break;
            case '🔡':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars(
                            16,
                            this.client.utils.CharSet.LowerCase
                        )}||`)
                    ],
                    ephemeral: true
                });

                break;
            case '🔢':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars(
                            16,
                            this.client.utils.CharSet.Numerical
                        )}||`)
                    ],
                    ephemeral: true
                });

                break;
            case '1️⃣':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars(
                            16,
                            this.client.utils.CharSet.UpperCase | this.client.utils.CharSet.LowerCase
                        )}||`)
                    ],
                    ephemeral: true
                });

                break;
            case '2️⃣':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars(
                            16,
                            this.client.utils.CharSet.UpperCase | this.client.utils.CharSet.LowerCase | this.client.utils.CharSet.Numerical
                        )}||`)
                    ],
                    ephemeral: true
                });
                
                break;
            case '3️⃣':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${this.client.utils.generateRandomChars(
                            16,
                            this.client.utils.CharSet.UpperCase | this.client.utils.CharSet.LowerCase | this.client.utils.CharSet.Numerical | this.client.utils.CharSet.Symbols
                        )}||`)
                    ],
                    ephemeral: true
                });
                
                break;
        };
    };
};