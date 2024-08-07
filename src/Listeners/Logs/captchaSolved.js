const { ModalSubmitInteraction } = require('discord.js');

const MessageEmbed = require('../../Managers/MessageEmbed');
const Event = require('../../Managers/Structures/Event');

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
        const logsId = await this.client.database.get(`${interaction.guild.id}.logs.channel`);
        const logs = logsId ? await interaction.guild.channels.fetch(logsId).catch(() => undefined) : undefined;

        if (modules.includes('logs') && logs) {
            logs.send({
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

        await this.client.database.delete(`${interaction.guild.id}.users.${interaction.user.id}.captcha`);
    };
};