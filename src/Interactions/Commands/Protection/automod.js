const { CommandInteraction, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

const MessageEmbed = require('../../../Commons/MessageEmbed');
const Command = require('../../../Core/Structures/Command');

module.exports = class AutoModCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'automod',
            description: 'Configurer le système d\'auto-mod.',
            category: 'protection',
            perms: [PermissionFlagsBits.ManageGuild],
            meperms: [PermissionFlagsBits.ManageGuild]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     */

    async run (interaction) {
        const profanityRule = (await interaction.guild.autoModerationRules.fetch()).find((rule) => rule.triggerType === this.client.config.automod.triggerType.profanity);
        const floodRule = (await interaction.guild.autoModerationRules.fetch()).find((rule) => rule.triggerType === this.client.config.automod.triggerType.flood);

        interaction.reply({
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
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('automod-type')
                    .setPlaceholder('Sélectionnez un type.')
                    .setOptions(
                        Object.entries(this.client.config.automod.type).map((type) => {
                            return {
                                label: type[1],
                                value: type[0]
                            }
                        })
                    )
                ),
            ]
        });
    };
};