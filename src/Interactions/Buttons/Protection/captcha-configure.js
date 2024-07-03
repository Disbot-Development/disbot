const Button = require('../../../Managers/Structures/Button');
const MessageEmbed = require('../../../Managers/MessageEmbed');
const { ButtonInteraction, PermissionFlagsBits, MessageCollector, ChannelType, Colors, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = class CaptchaConfigureButton extends Button {
    constructor(client) {
        super(client, {
            name: 'captcha-configure',
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
                    .setTitle('Captcha')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système de captcha est de faire remplir un formulaire avec un code à déchiffrer à tous les nouveaux membres qui rejoindront le serveur.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque de comptes Discord robotisés malveillants.\n\n` +
                        
                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Salon de vérification:** ${interaction.guild.channels.resolve(interaction.guild.getData('captcha.channel')) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> **Rôle de vérification:** ${interaction.guild.roles.resolve(interaction.guild.getData('captcha.roles.before')) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> **Rôle après vérification:** ${interaction.guild.roles.resolve(interaction.guild.getData('captcha.roles.after')) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> **Information supplémentaire:** Si vous ne configurez pas le salon et le rôle de vérification (minimum), le système de captcha ne pourra pas fonctionner.`
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
                        .setCustomId('captcha-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver')
                        .setDisabled(true),
                        new ButtonBuilder()
                        .setCustomId('captcha-configure')
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
                    .setTitle('Captcha')
                    .setDescription(
                        `${this.client.config.emojis.help} Le but du système de captcha est de faire remplir un formulaire avec un code à déchiffrer à tous les nouveaux membres qui rejoindront le serveur.\n` +
                        `Cela permet de sécuriser votre serveur en évitant l'attaque de comptes Discord robotisés malveillants.\n\n` +
                        
                        `> **Status:** Activé ${this.client.config.emojis.yes}\n` +
                        `> **Salon de vérification:** ${interaction.guild.channels.resolve(interaction.guild.getData('captcha.channel')) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> **Rôle de vérification:** ${interaction.guild.roles.resolve(interaction.guild.getData('captcha.roles.before')) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> **Rôle après vérification:** ${interaction.guild.roles.resolve(interaction.guild.getData('captcha.roles.after')) || `Non configuré ${this.client.config.emojis.no}`}\n` +
                        `> **Information supplémentaire:** Si vous ne configurez pas le salon et le rôle de vérification (minimum), le système de captcha ne pourra pas fonctionner.`
                    )
                    .setColor(Colors.Green)
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('captcha-toggle')
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Désactiver'),
                        new ButtonBuilder()
                        .setCustomId('captcha-configure')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.settings)
                        .setLabel('Configurer')
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
                    `**Veuillez mentionner le salon de vérification.**\n` +
                    `> \`create\`: Créer le salon.\n` +
                    `> \`reset\`: Réinitialiser le système de captcha.\n` +
                    `> \`cancel\`: Annuler la configuration.`
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
                interaction.guild.removeData('captcha');

                return enable();
            };

            if (channelAnswer.toLowerCase() === 'cancel') return enable();

            if (channelAnswer.toLowerCase() === 'create') {
                await interaction.guild.channels.create({
                    name: 'vérification',
                    type: ChannelType.GuildText
                })
                .then((ch) => {
                    interaction.guild.setData('captcha.channel', ch.id);
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

                    return enable;
                };

                interaction.guild.setData('captcha.channel', channel.id);
            };

            edit();

            const beforeRoleReply = await message.channel.send({
                embeds: [
                    new MessageEmbed()
                    .setStyle('LOADING')
                    .setDescription(
                        `**Veuillez mentionner le rôle de vérification.**\n` +
                        `> \`create\`: Créer le rôle.\n` +
                        `> \`reset\`: Réinitialiser le système de captcha.\n` +
                        `> \`cancel\`: Annuler la configuration.`
                    ) 
                ]
            });

            const beforeRoleCollector = new MessageCollector(interaction.channel, {
                max: 1,
                filter
            });

            beforeRoleCollector.on('collect', async (message) => {
                const beforeRoleAnswer = message.content.trim();

                const beforeRole = message.mentions.roles.first() || interaction.guild.roles.resolve(beforeRoleAnswer);

                beforeRoleReply.delete()
                .catch(() => 0);

                message.delete()
                .catch(() => 0);

                if (beforeRoleAnswer.toLowerCase() === 'reset') {
                    interaction.guild.removeData('captcha');

                    return enable();
                };

                if (beforeRoleAnswer.toLowerCase() === 'cancel') return enable();

                if (beforeRoleAnswer.toLowerCase() === 'create') {
                    await interaction.guild.roles.create({
                        name: 'Vérification',
                        color: Colors.Grey
                    })
                    .then((role) => {
                        interaction.guild.setData('captcha.roles.before', role.id);
                    });
                } else {
                    if (!beforeRole || beforeRole.id === interaction.guild.id) {
                        message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                .setStyle('ERROR')
                                .setDescription('Le rôle n\'est pas valide.')
                            ]
                        })
                        .then(async (msg) => {
                            await this.client.utils.wait(5000);
            
                            msg.delete()
                            .catch(() => 0);
                        });

                        return enable();
                    };
    
                    interaction.guild.setData('captcha.roles.before', beforeRole.id);

                    interaction.guild.channels.cache.forEach(async (channel) => {
                        if (!channel.permissionOverwrites) return;
                        
                        if (channel.id === interaction.guild.getData('captcha.channel')) {
                            await channel.permissionOverwrites.edit(interaction.guild.id, {
                                ViewChannel: false
                            });

                            await channel.permissionOverwrites.edit(interaction.guild.getData('captcha.roles.before'), {
                                ViewChannel: true
                            })
                        } else {
                            await channel.permissionOverwrites.edit(interaction.guild.getData('captcha.roles.before'), {
                                ViewChannel: false
                            });
                        };

                        await this.client.utils.wait(1000);
                    });
                };

                edit();

                const afterRoleReply = await message.channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setStyle('LOADING')
                        .setDescription(
                            `**Veuillez mentionner le rôle après la vérification.**\n` +
                            `> \`reset\`: Réinitialiser le système de captcha.\n` +
                            `> \`cancel\`: Annuler la configuration.`
                        ) 
                    ]
                });
    
                const afterRoleCollector = new MessageCollector(interaction.channel, {
                    max: 1,
                    filter
                });
    
                afterRoleCollector.on('collect', async (message) => {
                    const afterRoleAnswer = message.content.trim();
    
                    const afterRole = message.mentions.roles.first() || interaction.guild.roles.resolve(afterRoleAnswer);
    
                    afterRoleReply.delete()
                    .catch(() => 0);
    
                    message.delete()
                    .catch(() => 0);
    
                    if (afterRoleAnswer.toLowerCase() === 'reset') {
                        interaction.guild.removeData('captcha');

                        return enable();
                    };
    
                    if (afterRoleAnswer.toLowerCase() === 'cancel') return enable();

                    if (!afterRole || afterRole.id === interaction.guild.id) {
                        message.channel.send({
                            embeds: [
                                new MessageEmbed()
                                .setStyle('ERROR')
                                .setDescription('Le rôle n\'est pas valide.')
                            ]
                        })
                        .then(async (msg) => {
                            await this.client.utils.wait(5000);
            
                            msg.delete()
                            .catch(() => 0);
                        });

                        return enable();
                    };
    
                    interaction.guild.setData('captcha.roles.after', afterRole.id);

                    return enable();
                });
    
                afterRoleCollector.on('end', (collected) => {
                    if (!collected.size) {
                        afterRoleReply.delete()
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

            beforeRoleCollector.on('end', (collected) => {
                if (!collected.size) {
                    beforeRoleReply.delete()
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