const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, ApplicationCommandOptionType, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { readdirSync } = require('fs');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            description: 'Obtenir mes commandes.',
            category: 'information',
            options: [
                {
                    name: 'command',
                    description: 'Obtenir les informations d\'une commande.',
                    type: ApplicationCommandOptionType.String
                }
            ]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction
     */

    run (interaction) {
        const command = this.client.commands.get(interaction.options.getString('command'));

        if (command) {
            const permissions = Object.keys(this.client.config.permissions)
            .filter((perm) => (command.config.perms || []).includes(PermissionFlagsBits[perm]))
            .map((perm) => this.client.config.permissions[perm]);

            const mepermissions = Object.keys(this.client.config.permissions)
            .filter((perm) => (command.config.meperms || []).includes(PermissionFlagsBits[perm]))
            .map((perm) => this.client.config.permissions[perm]);

            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Disbot')
                    .setDescription(
                        `> **Nom:** \`/${command.config.name}\`\n` +
                        `> **Description:** ${command.config.description}\n` +
                        `> **Catégorie:** ${this.client.config.categories.emojis[command.config.category]} ${this.client.config.categories.labels[command.config.category]}\n` +
                        `> **Permission${permissions.length > 1 ? 's' : ''} requise${permissions.length > 1 ? 's' : ''}:** ${permissions.length ? permissions.map((perm) => `\`${perm}\``).join(', ') : `Aucune ${this.client.config.emojis.no}`}\n` +
                        `> **Permission${mepermissions.length > 1 ? 's' : ''} requise${mepermissions.length > 1 ? 's' : ''} pour Disbot:** ${mepermissions.length ? mepermissions.map((meperm) => `\`${meperm}\``).join(', ') : `Aucune ${this.client.config.emojis.no}`}`
                    )
                ]
            });
        } else {
            const commandsDir = readdirSync('./src/Interactions/Commands');
    
            const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                .setCustomId('help')
                .setPlaceholder('S\'il-vous-plaît, sélectionnez une catégorie.')
                .addOptions(
                    {
                        emoji: this.client.config.emojis.help,
                        label: 'Toutes les commandes',
                        value: 'all'
                    }
                )
            );
    
            for (let dir of commandsDir) {
                dir = dir.toLowerCase();
    
                row.components[0].addOptions(
                    {
                        emoji: this.client.config.categories.emojis[dir],
                        label: this.client.config.categories.labels[dir],
                        value: dir
                    }
                );
            };
    
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Disbot')
                    .setDescription(
                        `${this.client.config.emojis.bot} J'ai été développé par ${this.client.config.utils.devs.map((dev) => this.client.users.resolve(dev)).join(', ')}.\n` +
                        `${this.client.config.emojis.dev} Je possède ${this.client.commands.size} commandes slash.`
                    )
                ],
                components: [
                    row,
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(this.client.config.links.support)
                        .setEmoji(this.client.config.emojis.support)
                        .setLabel('Support'),
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(this.client.config.links.invite)
                        .setEmoji(this.client.config.emojis.bot)
                        .setLabel('Inviter')
                    )
                    ]
            });
        };
    };
};