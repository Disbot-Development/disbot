const { StringSelectMenuInteraction, ApplicationCommandOptionType } = require('discord.js');
const { readdirSync } = require('fs');

const SelectMenu = require('../../../Managers/Structures/SelectMenu');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class HelpSelectMenu extends SelectMenu {
    constructor(client) {
        super(client, {
            name: 'help'
        });
    };

    /**
     * 
     * @param {StringSelectMenuInteraction} interaction
     */

    async run (interaction) {
        const applicationCommands = await this.client.application.commands.fetch();

        switch (interaction.values[0]) {
            case 'home':
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle(this.client.config.username)
                        .setDescription(
                            `${this.client.config.emojis.help} ${this.client.config.username} est un projet de bot Discord dirigé par une équipe francophone dédié à la sécurité des serveurs. Je possède ${this.client.commands.size} commandes slash.\n\n` +
    
                            `${this.client.config.emojis.mod} Voici la liste des commandes utiles à la protection de votre serveur:\n` +
                            `> - ${this.client.getApplicationCommandString(applicationCommands, 'logs')}: Répertorier les actions importantes que j'ai réalisé sur le serveur.\n` +
                            `> - ${this.client.getApplicationCommandString(applicationCommands, 'captcha')}: Faire remplir un formulaire avec un code à déchiffrer à tous les nouveaux membres qui rejoindront le serveur.\n` +
                            `> - ${this.client.getApplicationCommandString(applicationCommands, 'antiraid')}: Bloquer la venue de nouveaux membres sur le serveur si trop d'utilisateurs rejoignent en peu de temps.`
                        )
                    ]
                });

                break;
            case 'all':
                const embed = new MessageEmbed()
                .setTitle(this.client.config.username)
                .setDescription(`${this.client.config.emojis.help} Voici l'intégralité de mes commandes:`)

                const commandsDir = readdirSync('./src/Interactions/Commands');

                for (let dir of commandsDir) {
                    dir = dir.toLowerCase();

                    embed.addFields(
                        {
                            name: `${this.client.config.categories.emojis[dir]} ${this.client.config.categories.labels[dir]} (${this.client.commands.filter((command) => command.config.category.toLowerCase() === dir).filter((command) => this.client.getApplicationSubCommands(applicationCommands, command.config.name).length).size ? this.client.commands.filter((command) => command.config.category.toLowerCase() === dir).filter((command) => this.client.getApplicationSubCommands(applicationCommands, command.config.name).length).size + this.client.commands.filter((command) => command.config.category.toLowerCase() === dir).size : this.client.commands.filter((command) => command.config.category.toLowerCase() === dir).size})`,
                            value: `> ${this.client.commands.filter((command) => command.config.category.toLowerCase() === dir).map((command) => this.client.getApplicationSubCommands(applicationCommands, command.config.name)?.length ? this.client.getApplicationSubCommands(applicationCommands, command.config.name).map((c) => this.client.getApplicationSubCommandString(applicationCommands, command.config.name, c.name)) : this.client.getApplicationCommandString(applicationCommands, command.config.name)).join(', ')}`
                        }
                    );
                };

                interaction.update({
                    embeds: [embed]
                });
                
                break;
            default:
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle(`${this.client.config.categories.emojis[interaction.values[0].toLowerCase()]} ${this.client.config.categories.labels[interaction.values[0].toLowerCase()]} (${this.client.commands.filter((command) => command.config.category.toLowerCase() === interaction.values[0].toLowerCase()).filter((command) => this.client.getApplicationSubCommands(applicationCommands, command.config.name).length).size ? this.client.commands.filter((command) => command.config.category.toLowerCase() === interaction.values[0].toLowerCase()).filter((command) => this.client.getApplicationSubCommands(applicationCommands, command.config.name).length).size + this.client.commands.filter((command) => command.config.category.toLowerCase() === interaction.values[0].toLowerCase()).size : this.client.commands.filter((command) => command.config.category.toLowerCase() === interaction.values[0].toLowerCase()).size})`)
                        .setDescription(
                            `${this.client.config.emojis.help} Voici l'intégralité des commandes de la catégorie ${this.client.config.categories.labels[interaction.values[0]].toLowerCase()}:\n` +
                            `> ${this.client.commands.filter((command) => command.config.category.toLowerCase() === interaction.values[0].toLowerCase()).map((command) => this.client.getApplicationSubCommands(applicationCommands, command.config.name)?.length ? this.client.getApplicationSubCommands(applicationCommands, command.config.name).map((c) => this.client.getApplicationSubCommandString(applicationCommands, command.config.name, c.name)) : this.client.getApplicationCommandString(applicationCommands, command.config.name)).join(', ')}`
                        )
                    ]
                });

                break;
        };
    };
};