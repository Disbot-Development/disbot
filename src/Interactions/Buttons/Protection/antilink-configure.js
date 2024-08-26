const { ButtonInteraction, PermissionFlagsBits, MessageCollector, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors, StringSelectMenuBuilder } = require('discord.js');

const MessageEmbed = require('../../../Commons/MessageEmbed');
const Button = require('../../../Core/Structures/Button');

module.exports = class AntiLinkConfigureButton extends Button {
    constructor(client) {
        super(client, {
            name: 'antilink-configure',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.ManageWebhooks]
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        const disable = () => {
            interaction.message.edit({
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId('antilink-type')
                        .setPlaceholder('Sélectionnez un type.')
                        .setOptions(
                            Object.entries(this.client.config.antilink.type).map((type) => {
                                return {
                                    label: type[1],
                                    value: type[0]
                                }
                            })
                        )
                        .setDisabled(true)
                    ),
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antilink-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver')
                        .setDisabled(true),
                        new ButtonBuilder()
                        .setCustomId('antilink-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                        .setDisabled(true)
                    )
                ]
            });
        };

        const enable = async () => {
            interaction.message.edit({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-link')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-link est de bloquer les messages qui contiennent des liens interdits.\n` +
                        `Cela permet d'anticiper la promotion de liens suspects (ou non).\n\n` +
                        
                        `${this.client.config.emojis.settings}・**Configuration:**\n` +
                        `> - **Statut:** Activé ${this.client.config.emojis.yes}\n` +
                        `> - **Liens interdits:** ${this.client.config.antilink.type[await this.client.database.get(`${interaction.guild.id}.antilink.type`)] || 'Aucun'}\n` +
                        `> - **Durée rendu muet:** ${await this.client.database.get(`${interaction.guild.id}.antilink.duration`) ? `${await this.client.database.get(`${interaction.guild.id}.antilink.duration`)} minute${await this.client.database.get(`${interaction.guild.id}.antilink.duration`) > 1 ? 's' : ''}` : `${this.client.config.antilink.duration} minute${this.client.config.antilink.duration > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> - **Information supplémentaire:** Tous les utilisateurs et bots Discord n'étant pas inscris dans la liste blanche se verront affectés par l'anti-link.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                        .setCustomId('antilink-type')
                        .setPlaceholder('Sélectionnez un type.')
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

        disable();

        const durationReply = await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('LOADING')
                .setDescription(
                    `**Veuillez indiquer la durée rendu muet en minutes.**\n` +
                    `> - \`reset\`: Réinitialiser le système d'anti-link.\n` +
                    `> - \`cancel\`: Annuler la configuration.`
                ) 
            ],
            fetchReply: true
        });

        const filter = (message) => message.author.id === interaction.user.id;

        const durationCollector = new MessageCollector(interaction.channel, {
            max: 1,
            filter
        });

        durationCollector.on('collect', async (message) => {
            const durationAnswer = message.content.trim();

            durationReply.delete()
            .catch(() => 0);

            message.delete()
            .catch(() => 0);

            if (durationAnswer.toLowerCase() === 'reset') {
                await this.client.database.delete(`${interaction.guild.id}.antilink`);

                return enable();
            };

            if (durationAnswer.toLowerCase() === 'cancel') return enable();

            if (isNaN(durationAnswer) || durationAnswer < 1 || durationAnswer % 1 !== 0 || durationAnswer >= 28 * 24 * 60) {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setStyle('ERROR')
                        .setDescription('La durée rendu muet n\'est pas valide. Doit être exprimé en chiffres et doit se trouver au dessus de 0. La durée maximale est de 28 jours.')
                    ]
                })
                .then(async (msg) => {
                    await this.client.utils.wait(5000);
    
                    msg.delete()
                    .catch(() => 0);
                });

                return enable();
            };

            await this.client.database.set(`${interaction.guild.id}.antilink.duration`, durationAnswer);

            return enable();
        });

        durationCollector.on('end', (collected) => {
            if (!collected.size) {
                durationReply.delete()
                .catch(() => 0);

                interaction.channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setStyle('ERROR')
                        .setDescription('Aucune réponse reçue.')
                    ]
                });

                return enable();
            };
        });
    };
};