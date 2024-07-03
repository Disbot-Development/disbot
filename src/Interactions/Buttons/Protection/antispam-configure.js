const Button = require('../../../Managers/Structures/Button');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { ButtonInteraction, PermissionFlagsBits, MessageCollector, ActionRowBuilder, ButtonBuilder, ButtonStyle, Colors } = require('discord.js');

module.exports = class AntiSpamConfigureButton extends Button {
    constructor(client) {
        super(client, {
            name: 'antispam-configure',
            perms: [PermissionFlagsBits.Administrator],
            meperms: [PermissionFlagsBits.ModerateMembers, PermissionFlagsBits.ManageMessages]
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
                    .setTitle('Anti-spam')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-spam est de bloquer les utilisateurs qui tentent d'envoyer des messages trop rapidement.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque d'utilisateurs Discord malveillants.\n\n` +
                        
                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Limite de messages en ${this.client.config.antispam.timeout} seconde${this.client.config.antispam.timeout > 1 ? 's' : ''}:** ${interaction.guild.getData('antispam.limit') ? `${interaction.guild.getData('antispam.limit')} message${interaction.guild.getData('antispam.limit') > 1 ? 's' : ''}` : `${this.client.config.antispam.limit} message${this.client.config.antispam.limit > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> **Durée de l'exclusion:** ${interaction.guild.getData('antispam.duration') ? `${interaction.guild.getData('antispam.duration')} minute${interaction.guild.getData('antispam.duration') > 1 ? 's' : ''}` : `60 minutes (par défaut)`}\n` +
                        `> **Information supplémentaire:** Tous les utilisateurs n'étant pas intégrés dans la liste blanche se verront affectés par l'anti-spam.`
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
                        .setCustomId('antispam-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver')
                        .setDisabled(true),
                        new ButtonBuilder()
                        .setCustomId('antispam-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
                        .setDisabled(true)
                    )
                ]
            });
        };

        const enable = () => {
            interaction.message.edit({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Anti-spam')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système d'anti-spam est de bloquer les utilisateurs qui tentent d'envoyer des messages trop rapidement.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque d'utilisateurs Discord malveillants.\n\n` +
                        
                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Limite de messages en ${this.client.config.antispam.timeout} seconde${this.client.config.antispam.timeout > 1 ? 's' : ''}:** ${interaction.guild.getData('antispam.limit') ? `${interaction.guild.getData('antispam.limit')} message${interaction.guild.getData('antispam.limit') > 1 ? 's' : ''}` : `${this.client.config.antispam.limit} message${this.client.config.antispam.limit > 1 ? 's' : ''} (par défaut)`}\n` +
                        `> **Durée de l'exclusion:** ${interaction.guild.getData('antispam.duration') ? `${interaction.guild.getData('antispam.duration')} minute${interaction.guild.getData('antispam.duration') > 1 ? 's' : ''}` : `60 minutes (par défaut)`}\n` +
                        `> **Information supplémentaire:** Tous les utilisateurs n'étant pas intégrés dans la liste blanche se verront affectés par l'anti-spam.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('antispam-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver'),
                        new ButtonBuilder()
                        .setCustomId('antispam-configure')
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
                    `**Veuillez indiquer la limite de messages en 10 secondes (10 recommandé).**\n` +
                    `> \`reset\`: Réinitialiser le système d'anti-spam.\n` +
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
                interaction.guild.removeData('antispam');

                return enable();
            };

            if (limitAnswer.toLowerCase() === 'cancel') return enable();

            if (isNaN(limitAnswer) || limitAnswer < 1) {
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

                return enable;
            };

            interaction.guild.setData('antispam.limit', limitAnswer);

            edit();

            const durationReply = await message.channel.send({
                embeds: [
                    new MessageEmbed()
                    .setStyle('LOADING')
                    .setDescription(
                        `**Veuillez indiquer la durée de l'exclusion en minutes.**\n` +
                        `> \`reset\`: Réinitialiser le système d'anti-spam.\n` +
                        `> \`cancel\`: Annuler la configuration.`
                    ) 
                ]
            });

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
                    interaction.guild.removeData('antispam');

                    return enable();
                };

                if (durationAnswer.toLowerCase() === 'cancel') return enable();

                if (isNaN(durationAnswer) || durationAnswer < 0) {
                    message.channel.send({
                        embeds: [
                            new MessageEmbed()
                            .setStyle('ERROR')
                            .setDescription('La durée de l\'exclusion n\'est pas valide. Doit être exprimé en chiffres et doit se trouver au dessus de 0.')
                        ]
                    })
                    .then(async (msg) => {
                        await this.client.utils.wait(5000);
        
                        msg.delete()
                        .catch(() => 0);
                    });

                    return enable();
                };

                interaction.guild.setData('antispam.duration', durationAnswer);

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