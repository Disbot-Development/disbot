const Command = require('../../../Managers/Structures/Command');
const { CommandInteraction, ApplicationCommandOptionType, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, AutocompleteInteraction, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
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
                    type: ApplicationCommandOptionType.String,
                    autocomplete: true
                }
            ]
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction
     */

    async run (interaction) {
        const command = this.client.commands.get(interaction.options.getString('command'));
        const applicationCommands = await this.client.application.commands.fetch();

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
                    .setTitle(this.client.config.username)
                    .setDescription(
                        `> **Nom:** </${applicationCommands.filter((cmd) => cmd.name === command.config.name).first().name}:${applicationCommands.filter((cmd) => cmd.name === command.config.name).first().id}>\n` +
                        `> **Description:** ${command.config.description}\n` +
                        `> **Catégorie:** ${this.client.config.categories.emojis[command.config.category]} ${this.client.config.categories.labels[command.config.category]}\n` +
                        `> **Permission${permissions.length > 1 ? 's' : ''} requise${permissions.length > 1 ? 's' : ''}:** ${permissions.length ? this.client.utils.joinCustomLastWord(permissions.map((perm) => `\`${perm}\``)) : `Aucune ${this.client.config.emojis.no}`}\n` +
                        `> **Permission${mepermissions.length > 1 ? 's' : ''} requise${mepermissions.length > 1 ? 's' : ''} pour Disbot:** ${mepermissions.length ? this.client.utils.joinCustomLastWord(mepermissions.map((meperm) => `\`${meperm}\``)) : `Aucune ${this.client.config.emojis.no}`}`
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
                    .setTitle(this.client.config.username)
                    .setDescription(
                        `${this.client.config.emojis.help} Disbot est un projet de bot Discord dirigé par une équipe francophone dédié à la sécurité des serveurs. Je possède ${this.client.commands.size} commandes slash.\n\n` +

                        `${this.client.config.emojis.mod} Voici la liste des commandes utiles à la protection de votre serveur:\n` +
                        `> - </${applicationCommands.filter((cmd) => cmd.name === 'logs').first().name}:${applicationCommands.filter((cmd) => cmd.name === 'logs').first().id}>: Répertorier les actions importantes que j'ai réalisé sur le serveur.\n` +
                        `> - </${applicationCommands.filter((cmd) => cmd.name === 'captcha').first().name}:${applicationCommands.filter((cmd) => cmd.name === 'captcha').first().id}>: Faire remplir un formulaire avec un code à déchiffrer à tous les nouveaux membres qui rejoindront le serveur.\n` +
                        `> - </${applicationCommands.filter((cmd) => cmd.name === 'antiraid').first().name}:${applicationCommands.filter((cmd) => cmd.name === 'antiraid').first().id}>: Bloquer la venue de nouveaux membres sur le serveur si trop d'utilisateurs rejoignent en peu de temps.`
                    )
                ],
                components: [
                    row,
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(this.client.config.links.website)
                        .setEmoji(this.client.config.emojis.search)
                        .setLabel('Site'),
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(this.client.config.links.invite)
                        .setEmoji(this.client.config.emojis.bot)
                        .setLabel('Inviter'),
                        new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setURL(this.client.config.links.support)
                        .setEmoji(this.client.config.emojis.support)
                        .setLabel('Support')
                    )
                ]
            });
        };
    };

    /**
     * 
     * @param {AutocompleteInteraction} interaction
     */

    async autocomplete (interaction) {
        const focusedValue = interaction.options.getFocused();
        const filtered = this.client.commands.filter((cmd) => cmd.config.name.includes(focusedValue));
        
        await interaction.respond(
            filtered.map((command) => (
                {
                    name: command.config.name,
                    value: command.config.name
                }
            )).slice(0, 25)
        );
    };
};