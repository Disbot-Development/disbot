const MessageEmbed = require('../../Commons/MessageEmbed');
const Event = require('../../Core/Structures/Event');

module.exports = class InteractionErrorEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'interactionError'
        });
    };

    /**
     * 
     * @param {Error} error
     */

    run (error) {
        this.client.channels.resolve(this.client.config.logs).send({
            content: this.client.config.utils.devs.map((dev) => this.client.users.resolve(dev)).join(', '),
            embeds: [
                new MessageEmbed()
                .setStyle('ERROR')
                .setDescription(`Désolé, une erreur est survenue. Pour plus d'informations, regardez la console.\`\`\`\n${error.stack ? error.stack : error.message}\n\`\`\``)
            ],
            repliedUser: true
        })
        .catch(() => 0);
        
        this.client.logger.error(`Interaction Error: ${`${error.stack ? error.stack : error.message}`.red}\n`);
    };
};