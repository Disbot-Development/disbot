const Event = require('../../Managers/Structures/Event');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { Interaction, PermissionFlagsBits } = require('discord.js');

module.exports = class InteractionCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'interactionCreate'
        });
    };

    /**
     * 
     * @param {Interaction} interaction
     */

    async run (interaction) {
        if (!interaction.guild) return interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription('Je ne fonctionne pas dans les messages privés, utilise moi sur un serveur !')
            ],
            ephemeral: true
        });

        let int;
        if (interaction.isButton()) int = this.client.buttons.get(interaction.customId);
        if (interaction.isCommand()) int = this.client.commands.get(interaction.commandName);
        if (interaction.isContextMenuCommand()) int = this.client.contextmenus.get(interaction.commandName);
        if (interaction.isModalSubmit()) int = this.client.modals.get(interaction.customId);
        if (interaction.isAnySelectMenu()) int = this.client.selectmenus.get(interaction.customId);
        if (interaction.isAutocomplete()) int = this.client.commands.get(interaction.commandName);

        if (!interaction.isAutocomplete()) {
            if (!int) return interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Désolé, une erreur est survenue.')
                ],
                ephemeral: true
            });
    
            if (int.config.perms && !interaction.member.permissions.has(int.config.perms)) {
                const permissions = Object.keys(this.client.config.permissions)
                .filter((perm) => (int.config.perms || []).includes(PermissionFlagsBits[perm]))
                .map((perm) => this.client.config.permissions[perm]);
            
                return interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setStyle('ERROR')
                        .setDescription(
                            `Désolé, vous n'avez pas la permission de réaliser ceci.\n` +
                            `> **Permission${permissions.length > 1 ? 's' : ''} requise${permissions.length > 1 ? 's' : ''}:** ${this.client.utils.joinCustomLastWord(permissions.map((perm) => `\`${perm}\``))}`
                        )
                    ],
                    ephemeral: true
                });
            };
    
            if (int.config.meperms && !interaction.guild.members.me.permissions.has(int.config.meperms)) {
                const permissions = Object.keys(this.client.config.permissions)
                .filter((perm) => (int.config.meperms || []).includes(PermissionFlagsBits[perm]))
                .map((perm) => this.client.config.permissions[perm]);
    
                interaction.reply({
                    embeds: [
                        new MessageEmbed()
                        .setStyle('ERROR')
                        .setDescription(
                            `Désolé, je n'ai pas la permission de réaliser ceci.\n` +
                            `> **Permission${permissions.length > 1 ? 's' : ''} requise${permissions.length > 1 ? 's' : ''}:** ${this.client.utils.joinCustomLastWord(permissions.map((perm) => `\`${perm}\``))}`
                        )
                    ],
                    ephemeral: true
                });
            };
        };

        if (interaction.isCommand() && !interaction.isContextMenuCommand()) this.client.emit('commandCreate', interaction, int);
        if (interaction.isButton()) this.client.emit('buttonCreate', interaction, int);
        if (interaction.isContextMenuCommand()) this.client.emit('contextMenuCreate', interaction, int);
        if (interaction.isModalSubmit()) this.client.emit('modalCreate', interaction, int);
        if (interaction.isAnySelectMenu()) this.client.emit('selectMenuCreate', interaction, int);
        if (interaction.isAutocomplete()) this.client.emit('autocompleteCreate', interaction, int);
    };
};