const { CommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const Command = require('../../Core/Structures/Command');
const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class CommandCreateEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'commandCreate'
        });
    };

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Command} command
     */
    
    async run (interaction, command) {
        try {
            await command.run(interaction);
            
            if (interaction.guild.members.me.roles.highest !== interaction.guild.roles.highest && interaction.user.id === interaction.guild.ownerId && !(await this.client.database.get(`${interaction.guild.id}.ignored`))?.includes('role')) interaction.channel.send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Rôle')
                    .setDescription('Mon rôle n\'est pas le plus haut, souhaitez-vous remédier ceci ?')
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setEmoji(this.client.config.emojis.no)
                        .setStyle(ButtonStyle.Danger)
                        .setCustomId('role-ignore')
                    )
                ]
            })
            .catch(() => 0);
        } catch(error) {
            interaction.reply({
                embeds: [
                    new MessageEmbed()
                    .setStyle('ERROR')
                    .setDescription('Désolé, une erreur est survenue.')
                ],
                ephemeral: true
            });

            this.client.emit('interactionError', error);
        };
    };
};