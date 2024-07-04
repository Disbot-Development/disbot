const Button = require('../../../Managers/Structures/Button');
const { ButtonInteraction, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageCollector } = require('discord.js');
const MessageEmbed = require('../../../Managers/MessageEmbed');

module.exports = class WhitelistRemoveButton extends Button {
    constructor(client) {
        super(client, {
            name: 'whitelist-remove',
            perms: [PermissionFlagsBits.Administrator],
            meperms: []
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction
     */

    async run (interaction) {
        await this.client.database.set(`${interaction.guild.id}.whitelist`, (await this.client.database.get(`${interaction.guild.id}.whitelist`) || []).filter((id) => interaction.guild.members.resolve(id)));
        
        const disable = () => {
            interaction.message.edit({
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('whitelist-add')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.yes)
                        .setLabel('Ajouter')
                        .setDisabled(true),
                        new ButtonBuilder()
                        .setCustomId('whitelist-remove')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Retirer')
                        .setDisabled(true)
                    )
                ]
            });
        };

        const enable = async () => {
            interaction.message.edit({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Liste blanche')
                    .setDescription(
                        `${this.client.config.emojis.help} Les utilisateurs inscrit dans la liste blanche ne seront pas affectés par la plupart des systèmes de protection. Faites attention aux utilisateurs inscrit.\n\n` +
    
                        `**Utilisateurs:**\n` +
                        `> ${(await this.client.database.get(`${interaction.guild.id}.whitelist`) || []).length ? (await this.client.database.get(`${interaction.guild.id}.whitelist`)).map((id) => interaction.guild.members.resolve(id)).join(', ') : 'Aucun utilisateur n\'est inscrit dans la liste blanche.'}`
                    )
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('whitelist-add')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.yes)
                        .setLabel('Ajouter'),
                        new ButtonBuilder()
                        .setCustomId('whitelist-remove')
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji(this.client.config.emojis.no)
                        .setLabel('Retirer')
                    )
                ]
            });
        };

        disable();

        const userReply = await interaction.reply({
            embeds: [
                new MessageEmbed()
                .setStyle('LOADING')
                .setDescription(
                    `**Veuillez mentionner l\'utilisateur à retirer.**\n` +
                    `> \`cancel\`: Annuler la configuration.`
                ) 
            ],
            fetchReply: true
        });

        const filter = (message) => message.author.id === interaction.user.id;

        const userCollector = new MessageCollector(interaction.channel, {
            max: 1,
            filter
        });

        userCollector.on('collect', async (message) => {
            const userAnswer = message.content.trim();

            const user = message.mentions.members.first() || interaction.guild.members.resolve(userAnswer);

            userReply.delete()
            .catch(() => 0);

            message.delete()
            .catch(() => 0);

            if (userAnswer.toLowerCase() === 'cancel') return enable();

            if (!user) {
                message.channel.send({
                    embeds: [
                        new MessageEmbed()
                        .setStyle('ERROR')
                        .setDescription('L\'utilisateur n\'est pas valide.')
                    ]
                })
                .then(async (msg) => {
                    await this.client.utils.wait(5000);
    
                    msg.delete()
                    .catch(() => 0);
                });

                return enable();
            };

            await this.client.database.pull(`${interaction.guild.id}.whitelist`, user.id);

            this.client.emit('whitelistRemove', interaction, user);

            return enable();
        });

        userCollector.on('end', (collected) => {
            if (!collected.size) {
                userReply.delete()
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