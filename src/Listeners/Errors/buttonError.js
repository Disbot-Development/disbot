const Event = require('../../Managers/Structures/Event');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { ButtonInteraction } = require('discord.js');

module.exports = class ButtonErrorEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'buttonError'
        });
    };

    /**
     * 
     * @param {ButtonInteraction} interaction 
     * @param {Error} error
     */

    run (interaction, error) {
        this.client.channels.resolve(this.client.config.logs).send({
            content: this.client.config.utils.devs.map((dev) => this.client.users.resolve(dev)).join(', '),
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription(`Désolé, une erreur est survenue. Pour plus d'informations, regardez la console.\`\`\`\n${error}\n\`\`\``)
            ],
            repliedUser: true
        })
        .catch(() => 0);
        
        this.client.logger.error(`Sorry, an error occured:\n➜ Button: ${`${interaction.customId}`.red}\n➜ Guild: ${`${interaction.guild.name}`.red}\n➜ Channel: ${`${interaction.channel.name}`.red}\n➜ User: ${`${interaction.user.tag}`.red}\n➜ Error: ${`${error}`.red}\n`);
    };
};