const Event = require('../../Managers/Structures/Event');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { ModalSubmitInteraction } = require('discord.js');

module.exports = class CaptchaSolvedEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'captchaSolved'
        });
    };

    /**
     * 
     * @param {ModalSubmitInteraction} interaction
     * @param {String} code 
     */
    
    run (interaction, code) {
        const modules = interaction.guild.getModules();

        if (modules.includes('logs') && interaction.guild.channels.resolve(interaction.guild.getData('logs.channel'))) {
            interaction.guild.channels.resolve(interaction.guild.getData('logs.channel')).send({
                embeds: [
                    new MessageEmbed()
                    .setTitle('Captcha')
                    .setDescription(
                        `Un utilisateur vient de résoudre son captcha.\n` +
                        `> **Utilisateur:** ${interaction.user} - \`${interaction.user.tag}\` - ${interaction.user.id}\n` +
                        `> **Code à résoudre:** \`${code}\``
                    )
                ]
            })
            .catch(() => 0);
        };
    };
};