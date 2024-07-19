const SelectMenu = require('../../../Managers/Structures/SelectMenu');
const { StringSelectMenuInteraction, PermissionFlagsBits } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class AutoModTypeSelectMenu extends SelectMenu {
    constructor(client) {
        super(client, {
            name: 'automod-type',
            perms: [PermissionFlagsBits.ManageGuild],
            meperms: [PermissionFlagsBits.ManageGuild]
        });
    };
    
    /**
     * 
     * @param {StringSelectMenuInteraction} interaction 
     */

    async run (interaction) {
        const profanityRule = (await interaction.guild.autoModerationRules.fetch()).find((rule) => rule.triggerType === this.client.config.automod.triggerType['profanity']);
        const floodRule = (await interaction.guild.autoModerationRules.fetch()).find((rule) => rule.triggerType === this.client.config.automod.triggerType['flood']);

        const edit = () => {
            interaction.update({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Auto-mod')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'auto-mod est de gérer l'auto-modération sur le serveur.\n` +
                        `Cela permet d'anticiper les membres tentants d'envoyer des messages nuisibles.\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Insultes et injures:** ${profanityRule && profanityRule.enabled ? `Activé ${this.client.config.emojis.yes}` : `Désactivé ${this.client.config.emojis.no}`}\n` +
                        `> - **Flood:** ${floodRule && floodRule.enabled ? `Activé ${this.client.config.emojis.yes}` : `Désactivé ${this.client.config.emojis.no}`}\n` +
                        `> - **Information supplémentaire:** Les membres de la liste blanche seront affectés.`
                    )
                ]
            })
            .catch(() => 0);
        };

        switch (interaction.values[0]) {
            case 'profanity':
                if (profanityRule) {
                    if (profanityRule.enabled) {
                        profanityRule.setEnabled(false)
                        .then(() => {
                            edit();
                        })
                        .catch(() => {
                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setStyle('ERROR')
                                    .setDescription('Je n\'ai pas pu désactiver le système d\'auto-mod.')
                                ],
                                ephemeral: true
                            });
                        });
                    } else {
                        profanityRule.setEnabled(true)
                        .then(() => {
                            edit();
                        })
                        .catch(() => {
                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setStyle('ERROR')
                                    .setDescription('Je n\'ai pas pu activer le système d\'auto-mod.')
                                ],
                                ephemeral: true
                            });
                        });
                    };
                } else {
                    interaction.guild.autoModerationRules.create({
                        name: this.client.config.automod.name[interaction.values[0]],
                        creatorId: this.client.user.id,
                        enabled: true,
                        eventType: this.client.config.automod.eventType[interaction.values[0]],
                        triggerType: this.client.config.automod.triggerType[interaction.values[0]],
                        triggerMetadata: {
                            presets: this.client.config.automod.triggerMetadata[interaction.values[0]]
                        },
                        actions: [
                            {
                                type: this.client.config.automod.actionType,
                                metadata: {
                                    customMessage: this.client.config.automod.customMessage
                                }
                            }
                        ]
                    })
                    .then(() => {
                        edit();
                    })
                    .catch(() => {
                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                .setStyle('ERROR')
                                .setDescription('Je n\'ai pas pu activer le système d\'auto-mod.')
                            ],
                            ephemeral: true
                        });
                    });
                };
            break;
            case 'flood':
                if (floodRule) {
                    if (floodRule.enabled) {
                        floodRule.setEnabled(false)
                        .then(() => {
                            edit();
                        })
                        .catch(() => {
                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setStyle('ERROR')
                                    .setDescription('Je n\'ai pas pu désactiver le système d\'auto-mod.')
                                ],
                                ephemeral: true
                            });
                        });
                    } else {
                        floodRule.setEnabled(true)
                        .then(() => {
                            edit();
                        })
                        .catch(() => {
                            interaction.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setStyle('ERROR')
                                    .setDescription('Je n\'ai pas pu activer le système d\'auto-mod.')
                                ],
                                ephemeral: true
                            });
                        });
                    };
                } else {
                    interaction.guild.autoModerationRules.create({
                        name: this.client.config.automod.name[interaction.values[0]],
                        creatorId: this.client.user.id,
                        enabled: true,
                        eventType: this.client.config.automod.eventType[interaction.values[0]],
                        triggerType: this.client.config.automod.triggerType[interaction.values[0]],
                        actions: [
                            {
                                type: this.client.config.automod.actionType,
                                metadata: {
                                    customMessage: this.client.config.automod.customMessage
                                }
                            }
                        ]
                    })
                    .then(() => {
                        edit();
                    })
                    .catch(() => {
                        interaction.reply({
                            embeds: [
                                new MessageEmbed()
                                .setStyle('ERROR')
                                .setDescription('Je n\'ai pas pu activer le système d\'auto-mod.')
                            ],
                            ephemeral: true
                        });
                    });
                };
            break;
        };
    };
};