const express = require('express');
const rateLimit = require('express-rate-limit');
const apicache = require('apicache').middleware;
const compression = require('compression');
const client = require('../../index');
const helmet = require('helmet');

module.exports = class RestAPI {

    /**
     * 
     * @param {client} client
     * @constructor
     */

    constructor(client) {
        this.app = express();
        this.client = client;
        this.port = this.client.config.port || 8000;
        this.routes = [];

        this.app.use(express.json());
        this.app.use(apicache('5 minutes'));
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
            { method: 'get', path: '/guilds', handler: this.getGuilds.bind(this) },
            { method: 'get', path: '/guilds/:id', handler: this.getGuild.bind(this) },
            { method: 'get', path: '/guilds/:id/roles', handler: this.getRoles.bind(this) },
            { method: 'get', path: '/guilds/:guildid/roles/:roleid', handler: this.getRole.bind(this) },
            { method: 'get', path: '/users', handler: this.getUsers.bind(this) },
            { method: 'get', path: '/users/:id', handler: this.getUser.bind(this) },
            { method: 'get', path: '/commands', handler: this.getCommands.bind(this) },
            { method: 'get', path: '/commands/:name', handler: this.getCommand.bind(this) },
            { method: 'get', path: '/version', handler: this.getVersion.bind(this) },
            { method: 'get', path: '/uptime', handler: this.getUptime.bind(this) },
            { method: 'get', path: '/health', handler: this.getHealth.bind(this) },
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

    getGuilds(req, res) {
        const guilds = this.client.guilds.cache.map((guild) => ({
            id: guild.id,
            name: guild.name,
            avatarURL: guild.iconURL(),
            memberCount: guild.memberCount
        }));
        
        return res.json({ guilds });
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

    async getRoles(req, res) {
        const guild = this.client.guilds.resolve(req.params.id);
        if (!guild) return res.status(404).json({ error: 'Guild not found' });
        
        const roles = (await guild.roles.fetch()).map((role) => ({
            id: role.id,
            name: role.name,
            members: role.members.size,
            color: role.hexColor,
        }));
        
        return res.json({ roles });
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
        const users = this.client.utils.allUsers;
        
        return res.json({ users });
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
        const commands = this.client.interactions.map((command) => ({ name: command.name, type: command.type ? 'contextmenu' : 'command' }));
        
        return res.json({ commands });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getCommand(req, res) {
        const command = this.client.interactions.map((command) => ({ name: command.name, type: command.type ? 'contextmenu' : 'command' })).filter((command) => command.name === req.params.name);
        if (!command) return res.status(404).json({ error: 'Command not found' });
        
        return res.json({ command });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getVersion(req, res) {
        const version = this.client.config.utils.version;
        
        return res.json({ version });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getUptime(req, res) {
        const uptime = this.client.uptime;
        
        return res.json({ uptime });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getHealth(req, res) {
        return res.json({ status: 'ok', uptime: this.client.uptime });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getRoutes(req, res) {
        const routes = this.routes.map(route => ({
            method: route.method.toUpperCase(),
            path: route.path
        }));

        return res.json({ routes });
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