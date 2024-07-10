const Button = require('../../../Managers/Structures/Button');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { ButtonInteraction, PermissionFlagsBits, MessageCollector, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

module.exports = class AntiRaidConfigureButton extends Button {
    constructor(client) {
        super(client, {
            name: 'antiraid-configure',
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
                        .setCustomId('antiraid-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver')
                        .setDisabled(true),
                        new ButtonBuilder()
                        .setCustomId('antiraid-configure')
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
                    .setTitle('Anti-raid')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-raid est de bloquer la venue de nouveaux membres sur le serveur si trop d'utilisateurs rejoignent en peu de temps.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque de comptes Discord robotisés malveillants.\n\n` +

                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Limite de comptes en ${this.client.config.antiraid.timeout} seconde${this.client.config.antiraid.timeout > 1 ? 's' : ''}:** ${await this.client.database.get(`${interaction.guild.id}.antiraid.limit`) ? `${await this.client.database.get(`${interaction.guild.id}.antiraid.limit`)} compte${await this.client.database.get(`${interaction.guild.id}.antiraid.limit`) > 1 ? 's' : ''}` : `${this.client.config.antiraid.limit} message${this.client.config.antiraid.limit > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> **Information supplémentaire:** Il est important que le mode communauté soit activé sur le serveur. Si le mode raid venait à s'activez, désactivez le depuis \`Paramètres du serveur\` ➜ \`Invitations\` ➜ \`Activer les invitations\`.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antiraid-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver'),
                        new ButtonBuilder()
                        .setCustomId('antiraid-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                    )
                ]
            });
        };

        disable();

        const limitReply = await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('LOADING')
                .setDescription(
                    `**Veuillez indiquer la limite de comptes en 10 secondes (10 recommandé).**\n` +
                    `> \`reset\`: Réinitialiser le système d'anti-raid.\n` +
                    `> \`cancel\`: Annuler la configuration.`
                ) 
            ],
            fetchReply: true
        });

        const filter = (message) => message.author.id === interaction.user.id;

        const limitCollector = new MessageCollector(interaction.channel, {
            max: 1,
            filter
        });

        limitCollector.on('collect', async (message) => {
            const limitAnswer = message.content.trim();

            limitReply.delete()
            .catch(() => 0);

            message.delete()
            .catch(() => 0);

            if (limitAnswer.toLowerCase() === 'reset') {
                await this.client.database.delete(`${interaction.guild.id}.antiraid`);

                return enable();
            };

            if (limitAnswer.toLowerCase() === 'cancel') return enable();

            if (isNaN(limitAnswer) || limitAnswer < 1 || limitAnswer % 1 !== 0) {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setStyle('ERROR')
                        .setDescription('La limite n\'est pas valide. Doit être exprimé en chiffres et doit se trouver au dessus de 0.')
                    ]
                })
                .then(async (msg) => {
                    await this.client.utils.wait(5000);
    
                    msg.delete()
                    .catch(() => 0);
                });

                return enable();
            };

            await this.client.database.set(`${interaction.guild.id}.antiraid.limit`, limitAnswer);

            return enable();
        });

        limitCollector.on('end', (collected) => {
            if (!collected.size) {
                limitReply.delete()
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