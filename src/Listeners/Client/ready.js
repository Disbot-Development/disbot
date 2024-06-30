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

        setInterval(() => {
            this.client.guilds.cache.forEach(async (guild) => {
                const modules = guild.getModules();

                if (modules.includes('captcha') && guild.channels.resolve(guild.getData('captcha.channel')) && guild.roles.resolve(guild.getData('captcha.roles.before'))) {
                    guild.members.cache.forEach((member) => {
                        const date = member.getData('captcha.date');
                        
                        if (date && date < Date.now()) {
                            member.kick('Cet utilisateur n\'a pas résolu le captcha dans les temps.')
                            .then(() => this.client.emit('captchaFailed', guild, member))
                            .catch(() => 0);
                        };
                    });

                    await this.client.utils.wait(500);
                };
            });
        }, 60000);
    };
};