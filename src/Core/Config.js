const { ActivityType, PresenceUpdateStatus, AutoModerationRuleEventType, AutoModerationRuleTriggerType, AutoModerationRuleKeywordPresetType, AutoModerationActionType, Colors } = require('discord.js');

module.exports = class Config {

    /**
     * 
     * @constructor
     */

    constructor() {
        this.baseURL = 'dis-bot.xyz';
        this.username = 'Disbot';

        this.utils = {
            token: process.env.TOKEN,
            betaToken: process.env.BETA_TOKEN,
            database: {
                uri: process.env.DATABASE_URI
            },
            invite: 'https://discord.com/oauth2/authorize?client_id=1233606057507422268',
            devs: ['1218940758061617153'],
            version: '1.6.9',
            presence: {
                name: `${this.baseURL}・{users} utilisateur{plural}`,
                type: ActivityType.Custom,
                status: PresenceUpdateStatus.Online
            }
        };

        this.restapi = {
            port: 8000,
            rateLimit: {
                limit: 5,
                cooldown: 10
            }
        };

        this.guild = '1238444132704194692';
        this.logs = '1238444203877597237';

        this.links = {
            invite: this.utils.invite,
            support: 'https://discord.gg/YPW3ZNuKW5',
            website: `https://${this.baseURL}`
        };

        this.embeds = {
            footer: `${this.username} ©️ ${new Date().getFullYear()}・Propulsé par Disbot Development`,
            color: Colors.Blurple
        };

        this.images = {
            logo: 'https://i.imgur.com/XuQ1IBQ.png'
        };

        this.antispam = {
            limit: 10,
            duration: 60,
            cooldown: 10,
        };

        this.antiraid = {
            limit: 10,
            cooldown: 10,
        };

        this.antialt = {
            age: 24
        };

        this.antilink = {
            type: {
                none: 'Aucun',
                discord: 'Discord',
                all: 'Tous'
            },
            duration: 10,
            regex: {
                discord: new RegExp('(https?:\\/\\/)?(www\\.)?((discordapp\\.com/invite)|(discord\\.gg))\\/(\\w+)', 'g'),
                all: new RegExp('https?:\\/\\/\\S+', 'g')
            },
            replace: '\`%&?!£ßæ#€@#%ß?€&£!æ@&£%?æ€\` *(lien censuré)*'
        };

        this.antitoken = {
            duration: 10,
            regex: new RegExp('(mfa\\.[\\w-]{84}|[\\w-]{24}\\.[\\w-]{6}\\.[\\w-]{27})', 'g')
        };

        this.automod = {
            name: {
                profanity: 'Bloquer les insultes, injures, propos haineux et propos à caractère sexuel.',
                flood: 'Bloquer la répétition de lettres ou mots.'
            },
            type: {
                profanity: 'Insultes et injures',
                flood: 'Flood'
            },
            eventType: {
                profanity: AutoModerationRuleEventType.MessageSend,
                flood: AutoModerationRuleEventType.MessageSend
            },
            triggerType: {
                profanity: AutoModerationRuleTriggerType.KeywordPreset,
                flood: AutoModerationRuleTriggerType.Spam
            },
            triggerMetadata: {
                profanity: [AutoModerationRuleKeywordPresetType.Profanity, AutoModerationRuleKeywordPresetType.SexualContent, AutoModerationRuleKeywordPresetType.Slurs]
            },
            actionType: AutoModerationActionType.BlockMessage,
            customMessage: `Ce message a été bloqué par le système d\'automodération de ${this.username}.`
        };

        this.captcha = {
            colors: {
                text: '#5865f2',
                trace: '#5865f2'
            }
        };

        this.permissions = {
            KickMembers: 'Expulser des membres',
            BanMembers: 'Bannir des membres',
            Administrator: 'Administrateur',
            ManageChannels: 'Gérer les salons',
            ManageGuild: 'Gérer le serveur',
            ViewAuditLog: 'Voir les logs du serveur',
            ManageMessages: 'Gérer les messages',
            ManageRoles: 'Gérer les rôles',
            ManageWebhooks: 'Gérer les webhooks',
            ModerateMembers: 'Exclure temporairement des membres'
        };

        this.emojis = {
            at: '<:d_at:1238444141260574851>',
            bot: '<:d_bot:1238444143429029960>',
            crown: '<:d_crown:1238444146860097587>',
            dev: '<:d_dev:1238444151654322226>',
            disbot: '<:d_disbot:1238444223544688680>',
            dnd: '<:d_dnd:1238444212769259541>',
            fire: '<:d_fire:1238444233925591150>',
            heart: '<:d_heart:1238444236089725020>',
            help: '<:d_help:1238444176379740171>',
            home: '<:d_home:1269448058714718238>',
            idle: '<:d_idle:1238444204364009564>',
            loading: '<a:d_loading:1238444215575380001>',
            lock: '<:d_lock:1238444145278976091>',
            mod: '<:d_mod:1238444163641380934>',
            money: '<:d_money:1238444148034371596>',
            music: '<:d_music:1238444150022475826>',
            no: '<:d_no:1238444239160082506>',
            offline: '<:d_offline:1238444203244130335>',
            online: '<:d_online:1238444191399415808>',
            partner: '<:d_partner:1238444153268998185>',
            pen: '<:d_pen:1238444156112863284>',
            pin: '<:d_pin:1238444167861112935>',
            rocket: '<:d_rocket:1238444237289295924>',
            search: '<:d_search:1238444154824949760>',
            settings: '<:d_settings:1238444169530441768>',
            sparkles: '<:d_sparkles:1238444179156111380>',
            support: '<:d_support:1238444165973409802>',
            tada: '<:d_tada:1238444181081296896>',
            trophy: '<:d_trophy:1238444226652667975>',
            unlock: '<:d_unlock:1238444225125941278>',
            user: '<:d_user:1238444201096777749>',
            voice: '<:d_voice:1238444189994188830>',
            wrench: '<:d_wrench:1238444188396294164>',
            yes: '<:d_yes:1238444198718345257>'
        };

        this.categories = {
            labels: {
                administrator: 'Administrateur',
                protection: 'Protection',
                moderation: 'Modération',
                information: 'Information'
            },
            emojis: {
                administrator: this.emojis.crown,
                protection: this.emojis.mod,
                moderation: this.emojis.support,
                information: this.emojis.search
            },
            level: {
                administrator: 1,
                protection: 2,
                moderation: 3,
                information: 4
            }
        };
    };
};
