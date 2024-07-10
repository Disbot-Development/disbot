const Button = require('../../../Managers/Structures/Button');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { ButtonInteraction, PermissionFlagsBits, MessageCollector, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

module.exports = class AntiAltConfigureButton extends Button {
    constructor(client) {
        super(client, {
            name: 'antialt-configure',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageGuild]
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
                        new ButtonBuilder()
                        .setCustomId('antialt-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver')
                        .setDisabled(true),
                        new ButtonBuilder()
                        .setCustomId('antialt-configure')
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
                    .setTitle('Anti-alt')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-alt est de bloquer la venue de nouveaux membres ayant un compte créé en dessous l'âge minimum.\n` +
                        `Cela permet d'anticiper les potentielles attaques de robots malveillants.\n\n` +

                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Âge minimum:** ${await this.client.database.get(`${interaction.guild.id}.antialt.age`) ? `${await this.client.database.get(`${interaction.guild.id}.antialt.age`)} heure${await this.client.database.get(`${interaction.guild.id}.antialt.age`) > 1 ? 's' : ''}` : `${this.client.config.antialt.age} heure${this.client.config.antialt.age > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> **Information supplémentaire:** Ce système n'affectera pas les bots Discord.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antialt-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver'),
                        new ButtonBuilder()
                        .setCustomId('antialt-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                    )
                ]
            });
        };

        disable();

        const ageReply = await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('LOADING')
                .setDescription(
                    `**Veuillez indiquer l'âge minimum en heures (24 recommandé).**\n` +
                    `> \`reset\`: Réinitialiser le système d'anti-alt.\n` +
                    `> \`cancel\`: Annuler la configuration.`
                ) 
            ],
            fetchReply: true
        });

        const filter = (message) => message.author.id === interaction.user.id;

        const ageCollector = new MessageCollector(interaction.channel, {
            max: 1,
            filter
        });

        ageCollector.on('collect', async (message) => {
            const ageAnswer = message.content.trim();

            ageReply.delete()
            .catch(() => 0);

            message.delete()
            .catch(() => 0);

            if (ageAnswer.toLowerCase() === 'reset') {
                await this.client.database.delete(`${interaction.guild.id}.antialt`);

                return enable();
            };

            if (ageAnswer.toLowerCase() === 'cancel') return enable();

            if (isNaN(ageAnswer) || ageAnswer < 1 || ageAnswer % 1 !== 0) {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setStyle('ERROR')
                        .setDescription('L\'âge minimum n\'est pas valide. Doit être exprimé en chiffres et doit se trouver au dessus de 0.')
                    ]
                })
                .then(async (msg) => {
                    await this.client.utils.wait(5000);
    
                    msg.delete()
                    .catch(() => 0);
                });

                return enable();
            };

            await this.client.database.set(`${interaction.guild.id}.antialt.age`, ageAnswer);

            return enable();
        });

        ageCollector.on('end', (collected) => {
            if (!collected.size) {
                ageReply.delete()
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