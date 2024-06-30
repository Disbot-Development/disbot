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
        
        const modules = member.guild.getModules();
        const captchaChannel = member.guild.channels.resolve(member.guild.getData('captcha.channel'));

        if (modules.includes('captcha') && captchaChannel) {
            const messages = await captchaChannel.messages.fetch();
            const message = messages.find((message) => message.id === member.getData('captcha.message'));

            if (message) message.delete()
            .catch(() => 0);

            member.removeData('captcha');
        };
    };
};