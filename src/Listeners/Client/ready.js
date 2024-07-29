const Event = require('../../Managers/Structures/Event');

module.exports = class ReadyEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'ready'
        });
    };
    
    async run () {
        this.client.connection.success({ text: `Disbot has been connected to the Discord API.` });

        switch (this.client.mode) {
            case 'remove':
                this.client.logger.success('Start in commands removal mode.\n');

                this.client.removeAllCommands();
            break;
            case 'deploy':
                this.client.logger.success('Start in commands deployment mode.\n');

                this.client.deployClientCommands();
            break;
        };
        
        const status = () => this.client.utils.setPresence();

        setInterval(status, 60000);

        setInterval(() => {
            this.client.guilds.cache.forEach(async (guild) => {
                const modules = await this.client.database.get(`${guild.id}.modules`) || [];

                const captchaChannel = guild.channels.resolve(await this.client.database.get(`${guild.id}.captcha.channel`));
                const captchaBeforeRole = guild.roles.resolve(await this.client.database.get(`${guild.id}.captcha.roles.before`));

                if (modules.includes('captcha') && captchaChannel && captchaBeforeRole) {
                    (await guild.members.fetch()).forEach(async (member) => {
                        const date = await this.client.database.get(`${guild.id}.users.${member.user.id}.captcha.date`);
                        
                        if (date < Date.now()) {
                            member.kick('Cet utilisateur n\'a pas résolu le captcha dans les temps.')
                            .then(() => this.client.emit('captchaFailed', guild, member))
                            .catch(() => 0);
                        };
                    });
                };
            });
        }, 10000);
    };
};