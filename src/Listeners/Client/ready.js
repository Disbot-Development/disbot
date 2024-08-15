const Event = require('../../Core/Structures/Event');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
    };
    
    async run () {
        this.client.connection.success({ text: `${this.client.config.username} has been connected to the Discord API.` });
        
        const status = () => this.client.loadPresence({
            name: this.client.config.utils.presence.name,
            type: this.client.config.utils.presence.type,
            status: this.client.config.utils.presence.status
        });
        
        status();
        setInterval(status, 60000);

        setInterval(() => {
            this.client.guilds.cache.forEach(async (guild) => {
                const modules = await this.client.database.get(`${guild.id}.modules`) || [];
                const members = Object.keys(await this.client.database.get(`${guild.id}.users`));

                const captchaChannel = await guild.channels.fetch(await this.client.database.get(`${guild.id}.captcha.channel`)).catch(() => null);
                const captchaBeforeRole = await guild.roles.fetch(await this.client.database.get(`${guild.id}.captcha.roles.before`)).catch(() => null);

                for (const id of members) {
                    const date = await this.client.database.get(`${guild.id}.users.${id}.captcha.date`);
                    const code = await this.client.database.get(`${guild.id}.users.${id}.captcha.code`);

                    if (modules.includes('captcha') && captchaChannel && captchaBeforeRole && date < 1000000000000000) {
                        const member = await guild.members.fetch(id);

                        member.kick('Cet utilisateur n\'a pas résolu le captcha dans les temps.')
                        .then(() => this.client.emit('captchaFailed', guild, member, code));
                    };
                };
            });
        }, 30000);
    };
};