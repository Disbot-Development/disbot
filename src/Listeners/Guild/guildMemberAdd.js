const Event = require('../../Managers/Structures/Event');
const { GuildMember, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ButtonStyle } = require('discord.js');
const MessageEmbed = require('../../Managers/MessageEmbed');
const { CaptchaGenerator } = require('captcha-canvas');

module.exports = class GuildMemberAddEvent extends Event {
    constructor(client) {
        super(client, {
            name: 'guildMemberAdd'
        });
    };

    /**
     * 
     * @param {GuildMember} member
     */


    async run (member) {
        const modules = await this.client.database.get(`${member.guild.id}.modules`);
        
        if (modules.includes('antibot') && member.user.bot) {
            member.kick('A été détecté par le système d\'anti-bot.')
            .then(() => this.client.emit('antibotDetected', member.guild, member, true))
            .catch(() => this.client.emit('antibotDetected', member.guild, member, false));
        };

        if (member.user.bot) return;

        if (modules.includes('antiraid') && member.guild.features.includes('COMMUNITY')) {
            const limit = await this.client.database.get(`${member.guild.id}.antiraid.limit`) || this.client.config.antiraid.limit;

            const members = await this.client.database.get(`${member.guild.id}.antiraid.members`) || [];
            const newMembers = members.filter((mem) => Date.now() - mem.date < this.client.config.antiraid.timeout * 1000);

            await this.client.database.set(`${member.guild.id}.antiraid.members`, newMembers);
            if (newMembers.length >= limit) {
                await this.client.database.delete(`${member.guild.id}.antiraid.members`);

                member.guild.disableInvites(true)
                .then((guild) => this.client.emit('antiraidDetected', guild, limit));

                newMembers.forEach((mem) => {
                    const kickedMember = member.guild.members.resolve(mem.id);

                    if (kickedMember) kickedMember.kick('A été détecté par le système d\'anti-raid.');
                });
            } else {
                await this.client.database.push(`${member.guild.id}.antiraid.members`, {
                    date: Date.now(),
                    id: member.user.id
                });
            };
        };

        const captchaBeforeRole = member.guild.roles.resolve(await this.client.database.get(`${member.guild.id}.captcha.roles.before`));
        const captchaChannel = member.guild.channels.resolve(await this.client.database.get(`${member.guild.id}.captcha.channel`));

        if (modules.includes('captcha') && captchaBeforeRole && captchaChannel) {
            member.roles.add(captchaBeforeRole)
            .catch(() => 0);

            const code = this.client.utils.generateRandomChars({length: 4, uppercase: true, numbers: true });
            const date = (await new Date().addMinutes(5)).getTime();

            await this.client.database.set(`${member.guild.id}.users.${member.user.id}.captcha.code`, code);
            await this.client.database.set(`${member.guild.id}.users.${member.user.id}.captcha.date`, date);

            const captcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({ text: code, size: 60, color: '#5865f2' })
            .setDecoy({ opacity: 0.5 })
            .setTrace({ color: '#5865f2' });

            const buffer = await captcha.generate();

            const image = new AttachmentBuilder(buffer)
            .setName('captcha.png');

            const message = await captchaChannel.send({
                content: `${member}`,
                embeds: [
                    new MessageEmbed()
                    .setTitle('Captcha')
                    .setDescription(
                        `Afin d\'obtenir l\'accès au reste du serveur, résolvez le captcha.\n` +
                        `> - Vous disposez de 5 minutes afin de résoudre le captcha. Si vous ne résolvez pas le captcha dans le temps imparti, vous serez exclu du serveur.`
                    )
                    .setImage('attachment://captcha.png')
                ],
                components: [
                    new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('captcha-resolve')
                        .setLabel('Résoudre')
                        .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                        .setCustomId('captcha-regenerate')
                        .setLabel('Regénérer')
                        .setStyle(ButtonStyle.Secondary)
                    )
                ],
                files: [
                    image
                ]
            });

            await this.client.database.set(`${member.guild.id}.users.${member.user.id}.captcha.message`, message.id);
        };
    };
};