const Event = require('../../Managers/Structures/Event');
const { GuildMember } = require('discord.js');

module.exports = class GuildMemberRemoveEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'guildMemberRemove'
        });
    };

    /**
     * 
     * @param {GuildMember} member 
     */
    
    async run (member) {
        if (member.user.bot) return;
        
        const modules = await this.client.database.get(`${member.guild.id}.modules`) || [];
        const captchaChannel = member.guild.channels.resolve(await this.client.database.get(`${member.guild.id}.captcha.channel`));

        if (modules.includes('captcha') && captchaChannel) {
            const message = (await captchaChannel.messages.fetch(await this.client.database.get(`${member.guild.id}.users.${member.user.id}.captcha.message`))).first();

            if (message) message.delete()
            .catch(() => 0);

            await this.client.database.delete(`${member.guild.id}.users.${member.user.id}.captcha`);
        };
    };
};