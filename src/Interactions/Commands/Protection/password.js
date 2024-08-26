const { CommandInteraction, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const MessageEmbed = require('../../../Commons/MessageEmbed');
const Command = require('../../../Core/Structures/Command');

module.exports = class PasswordCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'password',
            description: 'Générer un mot-de-passe sécurisé.',
            category: 'protection'
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    
    run (interaction) {
        interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('LOADING')
                .setDescription('Sélectionnez un type de mot-de-passe.')
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('password')
                    .setPlaceholder('Sélectionnez un type de mot-de-passe.')
                    .addOptions(
                        [
                            {
                                label: '🔠',
                                description: 'Majuscules',
                                value: '🔠',  
                            },
                            {
                                label: '🔡',
                                description: 'Minuscules',
                                value: '🔡',
                            },
                            {
                                label: '🔢',
                                description: 'Chiffres',
                                value: '🔢',
                            },
                            {
                                label: '1️⃣',
                                description: 'Majuscules et minuscules',
                                value: '1️⃣',  
                            },
                            {
                                label: '2️⃣',
                                description: 'Majuscules, minuscules et chiffres',
                                value: '2️⃣',  
                            },
                            {
                                label: '3️⃣',
                                description: 'Majuscules, minuscules, chiffres et symboles',
                                value: '3️⃣'
                            }
                        ]
                    )
                )
            ],
            fetchReply: true,
            ephemeral: true
        });
    };
};