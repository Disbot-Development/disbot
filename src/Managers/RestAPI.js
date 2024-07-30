const express = require('express');
const rateLimit = require('express-rate-limit');
const client = require('../../index');

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

        this.app.use(express.json());

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
        this.app.get('/api/guilds', this.getGuilds.bind(this));
        this.app.get('/api/users', this.getUsers.bind(this));
        this.app.get('/api/commands', this.getCommands.bind(this));
        this.app.get('/api/version', this.getVersion.bind(this));
        this.app.get('/api/uptime', this.getUptime.bind(this));

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
        const guildCount = this.client.guilds.cache.size;
        
        return res.json({ guilds: guildCount });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getUsers(req, res) {
        const userCount = this.client.utils.allUsers;
        
        return res.json({ users: userCount });
    };

    /**
     * 
     * @param {express.Request} req 
     * @param {express.Response} res
     * @returns {express.Response}
     */

    getCommands(req, res) {
        const commands = this.client.interactions.map((command) => ({name: command.name, type: command.type ? 'contextmenu' : 'command'}));
        
        return res.json({ commands });
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
        
        return res.json({ uptime, 'message': `This number represents the Discord timestamp from which ${this.client.config.username} is connected.` });
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