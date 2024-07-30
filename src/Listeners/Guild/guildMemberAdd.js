const Event = require('../../Managers/Structures/Event');
const { GuildMember, ActionRowBuilder, ButtonBuilder, AttachmentBuilder, ButtonStyle, GuildFeature, AllowedMentionsTypes } = require('discord.js');
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
        const modules = await this.client.database.get(`${member.guild.id}.modules`) || [];
        
        if (modules.includes('antibot') && member.user.bot) {
            member.kick('A été détecté par le système d\'anti-bot.')
            .then(() => this.client.emit('antibotDetected', member.guild, member, true))
            .catch(() => this.client.emit('antibotDetected', member.guild, member, false));

            await this.client.database.add('count.antibot', 1);
        };

        if (member.user.bot) return;

        if (modules.includes('antialt') && member.user.createdTimestamp - (await this.client.database.get(`${member.guild.id}.antialt.age`) || this.client.config.antialt.age) * 60 * 60 * 1000 <= 0) {
            member.kick('A été détecté par le système d\'anti-alt.')
            .then(() => this.client.emit('antialtDetected', member.guild, member, true, age))
            .catch(() => this.client.emit('antialtDetected', member.guild, member, false, age));

            return await this.client.database.add('count.antialt', 1);
        };

        if (modules.includes('antiraid') && member.guild.features.includes(GuildFeature.Community)) {
            const limit = await this.client.database.get(`${member.guild.id}.antiraid.limit`) || this.client.config.antiraid.limit;

            const members = await this.client.database.get(`${member.guild.id}.antiraid.members`) || [];
            const newMembers = members.filter((mem) => Date.now() - mem.date < this.client.config.antiraid.cooldown * 1000);

            await this.client.database.set(`${member.guild.id}.antiraid.members`, newMembers);
            if (newMembers.length >= limit) {
                await this.client.database.delete(`${member.guild.id}.antiraid.members`);

                member.guild.disableInvites(true)
                .then((guild) => this.client.emit('antiraidDetected', guild, limit));

                newMembers.forEach((mem) => {
                    const kickedMember = member.guild.members.resolve(mem.id);

                    if (kickedMember) kickedMember.kick('A été détecté par le système d\'anti-raid.');
                });

                await this.client.database.add('count.antiraid', 1);
            } else {
                await this.client.database.push(`${member.guild.id}.antiraid.members`, { date: Date.now(), id: member.user.id });
            };
        };

        const captchaBeforeRole = member.guild.roles.resolve(await this.client.database.get(`${member.guild.id}.captcha.roles.before`));
        const captchaChannel = member.guild.channels.resolve(await this.client.database.get(`${member.guild.id}.captcha.channel`));

        if (modules.includes('captcha') && captchaBeforeRole && captchaChannel) {
            member.roles.add(captchaBeforeRole)
            .catch(() => 0);

            const code = this.client.utils.generateRandomChars(
                4,
                this.client.utils.CharSet.UpperCase | this.client.utils.CharSet.Numerical
            );
            const date = new Date().addMinutes(5).getTime();

            await this.client.database.set(`${member.guild.id}.users.${member.user.id}.captcha.code`, code);
            await this.client.database.set(`${member.guild.id}.users.${member.user.id}.captcha.date`, date);

            const captcha = new CaptchaGenerator()
            .setDimension(150, 450)
            .setCaptcha({ text: code, size: 60, color: this.client.config.captcha.colors.text })
            .setDecoy({ opacity: 0.5 })
            .setTrace({ color: this.client.config.captcha.colors.trace });

            const buffer = await captcha.generate();
            const image = new AttachmentBuilder(buffer)
            .setName('captcha.png');

            captchaChannel.send({
                content: member.toString(),
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
                files: [ image ],
                allowedMentions: { parse: [AllowedMentionsTypes.User] }
            })
            .then(async (message) => await this.client.database.set(`${member.guild.id}.users.${member.user.id}.captcha.message`, message.id));
        };
    };
};