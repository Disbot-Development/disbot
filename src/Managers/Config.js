const { Colors, ActivityType, PresenceUpdateStatus, AutoModerationRuleEventType, AutoModerationRuleTriggerType, AutoModerationRuleKeywordPresetType, AutoModerationActionType } = require('discord.js');

module.exports = class Config {

    /**
     * 
     * @constructor
     */

    constructor() {
        this.baseURL = 'dis-bot.xyz';
        this.username = 'Disbot';
        this.dev = 'sey.ioo';

        this.utils = {
            token: process.env.TOKEN,
            invite: `https://discord.com/oauth2/authorize?client_id=1233606057507422268`,
            devs: ['1218940758061617153'],
            version: '1.6.0',
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

        this.roles = {
            news: '1254877996041506992',
            partners: '1260630871506157675',
            ad_exchange: '1264754123287302195'
        };

        this.links = {
            invite: this.utils.invite,
            support: `https://discord.gg/YPW3ZNuKW5`,
            website: `https://${this.baseURL}`
        };

        this.embeds = {
            footer: `${this.username} ©️ ${new Date().getFullYear()}・Fait avec ❤️ par ${this.dev}`,
            color: Colors.Blurple
        };

        this.images = {
            logo: 'https://i.imgur.com/XuQ1IBQ.png'
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

        this.permissions = {
            CreateInstantInvite: 'Créer une invitation instantanée',
            KickMembers: 'Expulser des membres',
            BanMembers: 'Bannir des membres',
            Administrator: 'Administrateur',
            ManageChannels: 'Gérer les salons',
            ManageGuild: 'Gérer le serveur',
            AddReactions: 'Ajouter des réactions',
            ViewAuditLog: 'Voir les logs',
            PrioritySpeaker: 'Voix prioritaire',
            Stream: 'Vidéo',
            ViewChannel: 'Voir le salon',
            SendMessages: 'Envoyer des messages',
            SendTTSMessages: 'Envoyer des messages TTS',
            ManageMessages: 'Gérer les messages',
            EmbedLinks: 'Intégrer des liens',
            AttachFiles: 'Joindre des fichiers',
            ReadMessageHistory: 'Lire l\'historique des messages',
            MentionEveryone: 'Mentionner @everyone',
            UseExternalEmojis: 'Utiliser des emojis externes',
            ViewGuildInsights: 'Voir les analyses du serveur',
            Connect: 'Se connecter',
            Speak: 'Parler',
            MuteMembers: 'Mettre en sourdine des membres',
            DeafenMembers: 'Rendre des membres sourds',
            MoveMembers: 'Déplacer des membres',
            UseVAD: 'Utiliser la détection de voix',
            ChangeNickname: 'Changer de pseudo',
            ManageNicknames: 'Gérer les pseudos',
            ManageRoles: 'Gérer les rôles',
            ManageWebhooks: 'Gérer les webhooks',
            ManageEmojisAndStickers: 'Gérer les emojis et les stickers',
            ManageGuildExpressions: 'Gérer les expressions du serveur',
            UseApplicationCommands: 'Utiliser des commandes d\'application',
            RequestToSpeak: 'Demander à parler',
            ManageEvents: 'Gérer les événements',
            ManageThreads: 'Gérer les fils de discussion',
            CreatePublicThreads: 'Créer des fils publics',
            CreatePrivateThreads: 'Créer des fils privés',
            UseExternalStickers: 'Utiliser des stickers externes',
            SendMessagesInThreads: 'Envoyer des messages dans les fils',
            UseEmbeddedActivities: 'Utiliser des activités intégrées',
            ModerateMembers: 'Modérer des membres',
            ViewCreatorMonetizationAnalytics: 'Voir les analyses de monétisation du créateur',
            UseSoundboard: 'Utiliser Soundboard',
            UseExternalSounds: 'Utiliser des sons externes',
            SendVoiceMessages: 'Envoyer des messages vocaux'
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
            }
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
                all: new RegExp('https?:\\/\\/[^\s/$.?#].[^\s]*', 'g')
            }
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
            customMessage: 'Ce message a été bloqué par le système d\'automodération de Disbot.'
        };

        this.captcha = {
            colors: {
                text: '#5865f2',
                trace: '#5865f2'
            }
        };
    };
};
