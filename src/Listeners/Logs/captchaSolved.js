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
    
    async run (interaction, code) {
        const modules = await this.client.database.get(`${interaction.guild.id}.modules`) || [];

        if (modules.includes('logs') && interaction.guild.channels.resolve(await this.client.database.get(`${interaction.guild.id}.logs.channel`))) {
            interaction.guild.channels.resolve(await this.client.database.get(`${interaction.guild.id}.logs.channel`)).send({
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