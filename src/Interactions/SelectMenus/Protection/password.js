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
        function generatePassword({ length = 16, lowercase = false, uppercase = false, numbers = false, symbols = false }) {
            const options = [
                { enabled: lowercase, chars: 'abcdefghijklmnopqrstuvwxyz' },
                { enabled: uppercase, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
                { enabled: numbers, chars: '0123456789' },
                { enabled: symbols, chars: '!@#$%^&*()+_-=}{[]|:;"/?.><,`~' }
            ];

            let characters = '';
            options.forEach((option) => {
                if (option.enabled) characters += option.chars;
            });
        
            return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
        };

        switch (interaction.values[0]) {
            case '🔠':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${generatePassword({ length: 16, uppercase: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
            case '🔡':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${generatePassword({ length: 16, lowercase: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
            case '🔢':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${generatePassword({ length: 16, numbers: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
            case '1️⃣':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${generatePassword({ length: 16, uppercase: true, lowercase: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
            case '2️⃣':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${generatePassword({ length: 16, uppercase: true, lowercase: true, numbers: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
            case '3️⃣':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle('Mot-de-passe')
                        .setDescription(`Voici votre mot de passe: ||${generatePassword({ length: 16, uppercase: true, lowercase: true, numbers: true, symbols: true })}||`)
                    ],
                    ephemeral: true
                });
            break;
        };
    };
};