const SelectMenu = require('../../../Managers/Structures/SelectMenu');
const { StringSelectMenuInteraction } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { readdirSync } = require('fs');

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
            case 'all':
                const embed = new MessageEmbed()
                .setTitle('Disbot')
                .setDescription(`${this.client.config.emojis.help} Voici l'intégralité de mes commandes:`)

                const commandsDir = readdirSync('./src/Interactions/Commands');

                for (let dir of commandsDir) {
                    dir = dir.toLowerCase();

                    embed.addFields(
                        {
                            name: `${this.client.config.categories.emojis[dir]} ${this.client.config.categories.labels[dir]} (${this.client.commands.filter((command) => command.config.category.toLowerCase() === dir).filter((command) => applicationCommands.filter((cmd) => command.config.name === cmd.name).first().options?.filter((opt) => opt.type === 1).length).size ? this.client.commands.filter((command) => command.config.category.toLowerCase() === dir).filter((command) => applicationCommands.filter((cmd) => command.config.name === cmd.name).first().options?.filter((opt) => opt.type === 1).length).size + this.client.commands.filter((command) => command.config.category.toLowerCase() === dir).size : this.client.commands.filter((command) => command.config.category.toLowerCase() === dir).size})`,
                            value: `> ${this.client.commands.filter((command) => command.config.category.toLowerCase() === dir).map((command) => applicationCommands.filter((cmd) => command.config.name === cmd.name).first().options?.filter((opt) => opt.type === 1)?.length ? applicationCommands.filter((cmd) => command.config.name === cmd.name).first().options.filter((opt) => opt.type === 1).map((c) => `</${applicationCommands.filter((cmd) => command.config.name === cmd.name).first().name} ${c.name}:${applicationCommands.filter((cmd) => command.config.name === cmd.name).first().id}>`) : `</${applicationCommands.filter((cmd) => command.config.name === cmd.name).first().name}:${applicationCommands.filter((cmd) => command.config.name === cmd.name).first().id}>`).join(', ')}`
                        }
                    );
                };

                interaction.update({
                    embeds: [
                        embed
                    ]
                });
            break;
            default:
                interaction.update({
                    embeds: [
                        new MessageEmbed()
                        .setTitle(`${this.client.config.categories.emojis[interaction.values[0].toLowerCase()]} ${this.client.config.categories.labels[interaction.values[0].toLowerCase()]} (${this.client.commands.filter((command) => command.config.category.toLowerCase() === interaction.values[0].toLowerCase()).filter((command) => applicationCommands.filter((cmd) => command.config.name === cmd.name).first().options?.filter((opt) => opt.type === 1).length).size ? this.client.commands.filter((command) => command.config.category.toLowerCase() === interaction.values[0].toLowerCase()).filter((command) => applicationCommands.filter((cmd) => command.config.name === cmd.name).first().options?.filter((opt) => opt.type === 1).length).size + this.client.commands.filter((command) => command.config.category.toLowerCase() === interaction.values[0].toLowerCase()).size : this.client.commands.filter((command) => command.config.category.toLowerCase() === interaction.values[0].toLowerCase()).size})`)
                        .setDescription(`
                            ${this.client.config.emojis.help} Voici l'intégralité des commandes de la catégorie ${this.client.config.categories.labels[interaction.values[0]].toLowerCase()}:
                            > ${this.client.commands.filter((command) => command.config.category.toLowerCase() === interaction.values[0].toLowerCase()).map((command) => applicationCommands.filter((cmd) => command.config.name === cmd.name).first().options?.filter((opt) => opt.type === 1)?.length ? applicationCommands.filter((cmd) => command.config.name === cmd.name).first().options.filter((opt) => opt.type === 1).map((c) => `</${applicationCommands.filter((cmd) => command.config.name === cmd.name).first().name} ${c.name}:${applicationCommands.filter((cmd) => command.config.name === cmd.name).first().id}>`) : `</${applicationCommands.filter((cmd) => command.config.name === cmd.name).first().name}:${applicationCommands.filter((cmd) => command.config.name === cmd.name).first().id}>`).join(', ')}
                        `)
                    ]
                });
            break;
        };
    };
};