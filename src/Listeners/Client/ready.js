const Event = require('../../Managers/Structures/Event');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
    };
    
    async run () {
        this.client.connection.success({ text: `${this.client.config.username} has been connected to the Discord API.` });
        
        const status = () => this.client.utils.setPresence();
        
        status();
        setInterval(status, 60000);

        setInterval(() => {
            this.client.guilds.cache.forEach(async (guild) => {
                const modules = await this.client.database.get(`${guild.id}.modules`) || [];
                const members = await guild.members.fetch()

                const captchaChannel = (await guild.channels.fetch()).find(async (ch) => ch.id === await this.client.database.get(`${guild.id}.captcha.channel`));
                const captchaBeforeRole = (await guild.roles.fetch()).find(async (r) => r.id === await this.client.database.get(`${guild.id}.captcha.roles.before`));

                if (modules.includes('captcha') && captchaChannel && captchaBeforeRole) {
                    members.forEach(async (member) => {
                        const date = await this.client.database.get(`${guild.id}.users.${member.user.id}.captcha.date`);

                        if (date < Date.now()) {
                            member.kick('Cet utilisateur n\'a pas résolu le captcha dans les temps.')
                            .then(() => this.client.emit('captchaFailed', guild, member));
                        };
                    });
                };

                const usersArray = Object.keys(await this.client.database.get(`${guild.id}.users`) || {});
                for (const user of usersArray) {
                    if (!members.get(user)) await this.client.database.delete(`${guild.id}.users.${user}`);
                };
            });
        }, 10000);
    };
};