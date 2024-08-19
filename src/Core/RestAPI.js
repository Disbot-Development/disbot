const rateLimit = require('express-rate-limit');
const compression = require('compression');
const Bot = require('../Core/Bot');
const express = require('express');
const helmet = require('helmet');

module.exports = class RestAPI {

    /**
     * 
     * @param {Bot} client
     * @constructor
     */

    constructor(client) {
        this.app = express();
        this.client = client;
        this.port = this.client.config.port || 8000;
        this.routes = [];

        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(compression());

        this.defineRateLimit();
        this.defineRoutes();

        this.app.use(this.notFoundHandler);
        this.app.use(this.errorHandler);
    };

    /**
     * 
     * @returns {void}
     */

    defineRateLimit() {
        const limiter = rateLimit({
            windowMs: this.client.config.restapi.rateLimit.cooldown * 1000,
            max: this.client.config.restapi.rateLimit.limit
        });

        return this.app.use(limiter);
    };

    /**
     * 
     * @returns {true}
     */

    defineRoutes() {
        const routes = [
            { method: 'get', path: '/stats', handler: this.getStats.bind(this) },
            { method: 'get', path: '/guilds', handler: this.getGuilds.bind(this) },
            { method: 'get', path: '/guilds/:id', handler: this.getGuild.bind(this) },
            { method: 'get', path: '/guilds/:id/channels', handler: this.getChannels.bind(this) },
            { method: 'get', path: '/guilds/:guildid/channels/:channelid', handler: this.getChannel.bind(this) },
            { method: 'get', path: '/guilds/:id/roles', handler: this.getRoles.bind(this) },
            { method: 'get', path: '/guilds/:guildid/roles/:roleid', handler: this.getRole.bind(this) },
            { method: 'get', path: '/users', handler: this.getUsers.bind(this) },
            { method: 'get', path: '/users/:id', handler: this.getUser.bind(this) },
            { method: 'get', path: '/commands', handler: this.getCommands.bind(this) },
            { method: 'get', path: '/commands/:name', handler: this.getCommand.bind(this) },
            { method: 'get', path: '/events', handler: this.getEvents.bind(this) },
            { method: 'get', path: '/events/:name', handler: this.getEvent.bind(this) },
            { method: 'get', path: '/version', handler: this.getVersion.bind(this) },
            { method: 'get', path: '/uptime', handler: this.getUptime.bind(this) },
            { method: 'get', path: '/ping', handler: this.getPing.bind(this) },
            { method: 'get', path: '/status', handler: this.getStatus.bind(this) },
            { method: 'get', path: '/routes', handler: this.getRoutes.bind(this) }
        ];
    
        for (const route of routes) {
            this.app[route.method](route.path, route.handler);
            this.routes.push(route);
        };
    
        return true;
    };

    /**
     * 
     * @returns {void}
     */

    start() {
        return this.app.listen(this.port);
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    async getStats(req, res) {
        const antibot = await this.client.database.get('count.antibot') || 0;
        const antialt = await this.client.database.get('count.antialt') || 0;
        const antiraid = await this.client.database.get('count.antiraid') || 0;
        const antilink = await this.client.database.get('count.antilink') || 0;
        const antitoken = await this.client.database.get('count.antitoken') || 0;
        const antispam = await this.client.database.get('count.antispam') || 0;
        const captchaResolved = await this.client.database.get('count.captcha.resolved') || 0;
        const captchaFailed = await this.client.database.get('count.captcha.failed') || 0;
        
        return res.json({
            antibot,
            antialt,
            antiraid,
            antilink,
            antitoken,
            antispam,
            captcha: {
                resolved: captchaResolved,
                failed: captchaFailed
            }
        });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getGuilds(req, res) {
        const sortedGuilds = this.client.guilds.cache.sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
        const guilds = sortedGuilds.reduce((acc, guild) => {
            acc[guild.id] = {
                id: guild.id,
                name: guild.name,
                avatarURL: guild.iconURL(),
                memberCount: guild.memberCount
            };

            return acc;
        }, {});
        
        return res.json(guilds);
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getGuild(req, res) {
        const guild = this.client.guilds.resolve(req.params.id);
        if (!guild) return res.status(404).json({ error: 'Guild not found' });
        
        return res.json({ 
            id: guild.id,
            name: guild.name,
            avatarURL: guild.iconURL(),
            memberCount: guild.memberCount
        });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    async getChannels(req, res) {
        const guild = this.client.guilds.resolve(req.params.id);
        if (!guild) return res.status(404).json({ error: 'Guild not found' });
        
        const channels = (await guild.channels.fetch()).reduce((acc, channel) => {
            acc[channel.id] = {
                id: channel.id,
                name: channel.name,
                type: channel.type,
                position: channel.position
            };

            return acc;
        }, {});
        
        return res.json(channels);
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    async getChannel(req, res) {
        const guild = this.client.guilds.resolve(req.params.guildid);
        if (!guild) return res.status(404).json({ error: 'Guild not found' });
        const channel = (await guild.channels.fetch()).find((channel) => channel.id === req.params.channelid);
        if (!channel) return res.status(404).json({ error: 'Channel not found' });
        
        return res.json({ 
            id: channel.id,
            name: channel.name,
            type: channel.type,
            position: channel.position
        });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    async getRoles(req, res) {
        const guild = this.client.guilds.resolve(req.params.id);
        if (!guild) return res.status(404).json({ error: 'Guild not found' });
        
        const roles = (await guild.roles.fetch()).reduce((acc, role) => {
            acc[role.id] = {
                id: role.id,
                name: role.name,
                members: role.members.size,
                color: role.hexColor
            };

            return acc;
        }, {});
        
        return res.json(roles);
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    async getRole(req, res) {
        const guild = this.client.guilds.resolve(req.params.guildid);
        if (!guild) return res.status(404).json({ error: 'Guild not found' });
        const role = (await guild.roles.fetch()).find((role) => role.id === req.params.roleid);
        if (!role) return res.status(404).json({ error: 'Role not found' });
        
        return res.json({ 
            id: role.id,
            name: role.name,
            members: role.members.size,
            color: role.hexColor
        });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getUsers(req, res) {
        const users = this.client.allUsers;
        
        return res.json(users);
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    async getUser(req, res) {
        const user = await this.client.users.fetch(req.params.id).catch(() => 0);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        return res.json({
            id: user.id,
            name: user.globalName,
            tag: user.tag,
            avatarURL: user.avatarURL(),
            bot: user.bot
        });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getCommands(req, res) {
        const commandsMap = this.client.commands.map((command) => command.config);
        const commands = commandsMap.reduce((acc, command) => {
            acc[command.name] = {
                name: command.name,
                description: command.description,
                category: command.category,
                options: command.options
            };

            return acc;
        }, {});
    
        return res.json(commands);
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getCommand(req, res) {
        const commands = this.client.commands.map((command) => command.config);
        const command = commands.find((command) => command.name === req.params.name);
        if (!command) return res.status(404).json({ error: 'Command not found' });
        
        return res.json({
            name: command.name,
            description: command.description,
            category: command.category,
            options: command.options
        });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getEvents(req, res) {
        const eventsMap = this.client.events.map((event) => event.config);

        const events = eventsMap.reduce((acc, event) => {
            acc[event.name] = {
                name: event.name
            };

            return acc;
        }, {});
        
        return res.json(events);
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getEvent(req, res) {
        const events = this.client.events.map((event) => event.config);
        const event = events.find((event) => event.name === req.params.name);
        if (!event) return res.status(404).json({ error: 'Event not found' });
        
        return res.json(event);
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getVersion(req, res) {
        const version = this.client.config.utils.version;
        
        return res.json(version);
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getUptime(req, res) {
        const uptime = this.client.uptime;
        
        return res.json(uptime);
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getPing(req, res) {
        const ping = this.client.ws.ping;
        
        return res.json(ping);
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getStatus(req, res) {
        const uptime = this.client.uptime;
        const ping = this.client.ws.ping;

        return res.json({ status: 'ok', uptime, ping });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getRoutes(req, res) {
        const routes = this.routes.reduce((acc, route) => {
            acc[route.path] = {
                path: route.path,
                method: route.method.toUpperCase()
            };

            return acc;
        }, {});

        return res.json(routes);
    };

    /**
     * 
     * @param {express.Request} req
     * @param {express.Response} res
     * @returns {express.Response}
     */

    notFoundHandler(req, res) {
        return res.status(404).json({ error: 'Not found' });
    };

    /**
     * 
     * @param {Error} err 
     * @param {express.Request} req 
     * @param {express.Response} res 
     * @param {express.NextFunction} next 
     * @returns {express.Response}
     */

    errorHandler(err, req, res) {
        return res.status(500).json({ error: 'An internal error occurred' });
    };
};