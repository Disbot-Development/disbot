const Button = require('../../../Managers/Structures/Button');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { ButtonInteraction, PermissionFlagsBits, MessageCollector, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

module.exports = class LogsConfigureButton extends Button {
    constructor(client) {
        super(client, {
            name: 'logs-configure',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ManageChannels, PermissionFlagsBits.ManageRoles]
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        const edit = () => {
            interaction.message.edit({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Logs')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système de logs est de répertorier les actions importantes que j'ai réalisé sur le serveur.\n` +
                        `Cela permet de suivre mes actions et les raisons de mes actions.\n\n` +
                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Salon de logs:** ${interaction.guild.channels.resolve(interaction.guild.getData('logs.channel')) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> **Information supplémentaire:** Veillez à ce que je garde l'accès au salon. Faites attention à qui vous donnez l'accès aux logs.`
                    )
                    .setColor(Colors.Green)
                ]
            });    
        };

        const disable = () => {
            interaction.message.edit({
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('logs-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver')
                        .setDisabled(true),
                        new ButtonBuilder()
                        .setCustomId('logs-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                        .setDisabled(true),
                    )
                ]
            });
        };

        const enable = () => {
            interaction.message.edit({
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('logs-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver'),
                        new ButtonBuilder()
                        .setCustomId('logs-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer'),
                    )
                ]
            });
        };

        disable();

        const channelReply = await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('LOADING')
                .setDescription(
                    `**Veuillez mentionner le salon de logs.**\n` +
                    `> \`create\`: Créer le salon.\n` +
                    `> \`reset\`: Réinitialiser le système de logs.\n` +
                    `> \`cancel\`: Annuler la configuration.\n`
                ) 
            ],
            fetchReply: true
        });

        const filter = (message) => message.author.id === interaction.user.id;

        const channelCollector = new MessageCollector(interaction.channel, {
            max: 1,
            filter
        });

        channelCollector.on('collect', async (message) => {
            const channelAnswer = message.content.trim();

            const channel = message.mentions.channels.first() || interaction.guild.channels.resolve(channelAnswer);

            channelReply.delete()
            .catch(() => 0);

            message.delete()
            .catch(() => 0);

            if (channelAnswer.toLowerCase() === 'reset') {
                interaction.guild.removeData('logs');

                edit();
                return enable();
            };

            if (channelAnswer.toLowerCase() === 'cancel') return enable();

            if (channelAnswer.toLowerCase() === 'create') {
                await interaction.guild.channels.create({
                    name: 'disbot-logs',
                    type: ChannelType.GuildText
                })
                .then((ch) => {
                    interaction.guild.setData('logs.channel', ch.id);

                    ch.send({
                        embeds: [
                            new MessageEmbed()
                            .setStyle('SUCCESS')
                            .setDescription('Ce salon a été défini comme le salon des logs.')
                        ]
                    })
                    .catch(() => 0);
                });
            } else {
                if (!channel || (channel && channel.type !== ChannelType.GuildText)) {
                    message.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setStyle('ERROR')
                            .setDescription('Le salon n\'est pas valide.')
                        ]
                    })
                    .then(async (msg) => {
                        await this.client.utils.wait(5000);
        
                        msg.delete()
                        .catch(() => 0);
                    });

                    return enable();
                };

                interaction.guild.setData('logs.channel', channel.id);

                channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setStyle('SUCCESS')
                        .setDescription('Ce salon a été défini comme le salon des logs.')
                    ]
                })
                .catch(() => 0);
            };

            edit();
            return enable();
        });

        channelCollector.on('end', (collected) => {
            if (!collected.size) {
                channelReply.delete()
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