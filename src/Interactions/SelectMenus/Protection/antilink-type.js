const SelectMenu = require('../../../Managers/Structures/SelectMenu');
const { StringSelectMenuInteraction, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class AntiLinkTypeSelectMenu extends SelectMenu {
    constructor(client) {
        super(client, {
            name: 'antilink-type',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageMessages]
        });
    };
    
    /**
     * 
     * @param {StringSelectMenuInteraction} interaction 
     */

    async run (interaction) {
        switch (interaction.values[0]) {
            case 'none':
                await this.client.database.delete(`${interaction.guild.id}.antilink.type`);
                
                break;
            default:
                await this.client.database.set(`${interaction.guild.id}.antilink.type`, interaction.values[0]);
                
                break;
        };

        interaction.update({
            embeds: [
                new MessageEmbed()
                .setTitle('Anti-link')
                .setDescription(
                    `${this.client.config.emojis.help} Le but du système d'anti-link est de bloquer les messages qui contiennent des liens interdits.\n` +
                    `Cela permet d'anticiper la promotion de liens suspects (ou non).\n\n` +
                    
                    `${this.client.config.emojis.settings}・**Configuration:**\n` +
                    `> - **Status:** Activé ${this.client.config.emojis.yes}\n` +
                    `> - **Liens interdits:** ${this.client.config.antilink.type[await this.client.database.get(`${interaction.guild.id}.antilink.type`)] || 'Aucun'}\n` +
                    `> - **Durée rendu muet:** ${await this.client.database.get(`${interaction.guild.id}.antilink.duration`) ? `${await this.client.database.get(`${interaction.guild.id}.antilink.duration`)} minute${await this.client.database.get(`${interaction.guild.id}.antilink.duration`) > 1 ? 's' : ''}` : `${this.client.config.antilink.duration} minute${this.client.config.antilink.duration > 1 ? 's' : ''} (par défaut)`}\n` +
                    `> - **Information supplémentaire:** Ce système n'affectera pas les bots Discord.`
                )
                .setColor(Colors.Green)
            ],
            components: [
                new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                    .setCustomId('antilink-type')
                    .setPlaceholder('S\'il-vous-plaît, sélectionnez un type.')
                    .setOptions(
                        Object.entries(this.client.config.antilink.type).map((type) => {
                            return {
                                label: type[1],
                                value: type[0]
                            }
                        })
                    )
                ),
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                    .setCustomId('antilink-toggle')
                    .setStyle(ButtonStyle.Primary)
                    .setEmoji(this.client.config.emojis.no)
                    .setLabel('Désactiver'),
                    new ButtonBuilder()
                    .setCustomId('antilink-configure')
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji(this.client.config.emojis.settings)
                    .setLabel('Configurer')
                )
            ]
        });
    };
};