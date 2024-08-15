const { Client, ClientOptions, Collection, PermissionFlagsBits, ApplicationCommandOption, ApplicationCommandType, ApplicationCommandManager, ApplicationCommand, ApplicationCommandSubCommand, ApplicationCommandOptionType, ClientPresence, ActivityType, PresenceUpdateStatus } = require('discord.js');
const { QuickDB, MongoDriver } = require('quick.db');
const { createSpinner, Spinner } = require('nanospinner');

const Prototypes = require('../Commons/Prototypes');
const RestAPI = require('./RestAPI');
const Config = require('./Config');
const Logger = require('../Commons/Logger');
const Utils = require('../Commons/Utils');

module.exports = class Bot extends Client {

    /**
     * 
     * @param {ClientOptions} options
     * @constructor
     */

    constructor(options) {
        super(options);

        new Prototypes(this);
    };

    config = new Config();
    utils = new Utils(this);
    logger = new Logger(this.config);
    
    performance = { start: 0, end: 0 };

    devMode = false;

    /**
     * 
     * @typedef {Object} CommandConfig
     * @property {String} name
     * @property {String} description 
     * @property {'administrator'|'information'|'moderation'|'protection'} category
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     * @property {ApplicationCommandOption[]} options
     */

    /**
     * 
     * @typedef {Object} Command
     * @property {CommandConfig} config
     */

    /**
     * 
     * @type {Collection<String, Command>}
     */

    commands = new Collection();

    /**
     * 
     * @typedef {Object} ContextMenuConfig
     * @property {String} name
     * @property {ApplicationCommandType} type
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {Object} ContextMenu
     * @property {ContextMenuConfig} config
     */

    /**
     * @type {Collection<String, ContextMenu>}
     */

    contextmenus = new Collection();

    /**
     * 
     * @typedef {Object} ButtonConfig
     * @property {String} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {Object} Button
     * @property {ButtonConfig} config
     */

    /**
     * @type {Collection<String, Button>}
     */

    buttons = new Collection();
    
    /**
     * 
     * @typedef {Object} SelectMenuConfig
     * @property {String} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {Object} SelectMenu
     * @property {SelectMenuConfig} config
     */

    /**
     * @type {Collection<String, SelectMenu>}
     */

    selectmenus = new Collection();

    /**
     * 
     * @typedef {Object} ModalConfig
     * @property {String} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {Object} Modal
     * @property {ModalConfig} config
     */

    /**
     * @type {Collection<String, Modal>}
     */

    modals = new Collection();

    /**
     * 
     * @typedef {Object} EventConfig
     * @property {String} name
     */

    /**
     * 
     * @typedef {Object} Event
     * @property {EventConfig} config
     */

    /**
     * @type {Collection<String, Event>}
     */

    events = new Collection();

    /**
     * @returns {Collection<String, CommandConfig|ContextMenuConfig>}
     */

    get interactions() {
        return [].concat(this.commands.map((command) => command.config), this.contextmenus.map((contextmenu) => contextmenu.config));
    };

    /**
     * 
     * @returns {Number}
     */

    get allUsers() {
        return this.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    };

    /**
     * 
     * @param {ApplicationCommandManager} applicationCommands 
     * @param {String} name 
     * @returns {ApplicationCommand<any>|undefined}
     */

    getApplicationCommand(applicationCommands, name) {
        return applicationCommands.find((cmd) => cmd.name === name);
    };

    /**
     * 
     * @param {ApplicationCommandManager} applicationCommands 
     * @param {String} name 
     * @returns {ApplicationCommandSubCommand<any>[]|undefined}
     */

    getApplicationSubCommands(applicationCommands, name) {
        return this.getApplicationCommand(applicationCommands, name).options?.filter((opt) => opt.type === ApplicationCommandOptionType.Subcommand);
    };

    /**
     * 
     * @param {ApplicationCommandManager} applicationCommands 
     * @param {String} name 
     * @returns {String}
     */

    getApplicationCommandString(applicationCommands, name) {
        return `</${applicationCommands.find((cmd) => cmd.name === name).name}:${applicationCommands.find((cmd) => cmd.name === name).id}>`;
    };
    
    /**
     * 
     * @param {ApplicationCommandManager} applicationCommands 
     * @param {String} name 
     * @param {String} subname 
     * @returns {String}
     */

    getApplicationSubCommandString(applicationCommands, name, subname) {
        return `</${this.getApplicationCommand(applicationCommands, name).name} ${subname}:${this.getApplicationCommand(applicationCommands, name).id}>`
    };

    /**
     * 
     * @param {Object} options
     * @param {String} options.name
     * @param {ActivityType} options.type
     * @param {PresenceUpdateStatus} options.status
     * @returns {ClientPresence}
     */

    loadPresence(options) {
        const users = this.allUsers;
        
        let plural = 0;
        const presenceName = options.name.replace(/{\w+}/g, (match) => {
            switch (match) {
                case '{users}':
                    if (users > 1) ++plural;
                    return users.toLocaleString();
                case '{plural}':
                    return plural ? 's' : '';
            };
        });

        return this.user.setPresence({
            activities: [{ name: presenceName, type: options.type }],
            status: options.status
        });
    };

    /**
     * 
     * @returns {Promise<QuickDB<any>>}
     */

    async loadDatabase() {
        this.performance.start = performance.now();

        const driver = new MongoDriver(process.env.DATABASE_URI);
        await driver.connect();

        this.database = new QuickDB({ driver });
        await this.database.init();

        this.performance.end = performance.now();

        this.logger.success('The database was linked.', { start: this.performance.start, end: this.performance.end });
        return this.database;
    };

    /**
     * 
     * @returns {Promise<RestAPI>}
     */

    async loadRestAPI() {
        this.performance.start = performance.now();

        this.restapi = new RestAPI(this);
        this.restapi.start();

        this.performance.end = performance.now();

        this.logger.success(`The Rest API was loaded.`, { start: this.performance.start, end: this.performance.end });
        return this.restapi;
    };

    /**
     * 
     * @returns {Promise<Collection<String, Command>>}
     */

    async loadCommands() {
        this.performance.start = performance.now();

        const filesPath = this.utils.getFiles('./src/Interactions/Commands', ['.js']);
        for (const path of filesPath) {
            const command = new (require(`../../${path}`))(this);
            if (!command.run || !command.config || !command.config.name || !command.config.description) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.commands.set(command.config.name, command);
        };

        this.performance.end = performance.now();

        this.logger.success(`${this.commands.size} commands has been loaded.`, { start: this.performance.start, end: this.performance.end });
        return this.commands;
    };

    /**
     * 
     * @returns {Promise<Collection<String, ContextMenu>>}
     */

    async loadContextMenus() {
        this.performance.start = performance.now();

        const filesPath = this.utils.getFiles('./src/Interactions/ContextMenus', ['.js']);
        for (const path of filesPath) {
            const contextmenu = new (require(`../../${path}`))(this);
            if (!contextmenu.run || !contextmenu.config || !contextmenu.config.name || !contextmenu.config.type) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]} doesn't have required data.`);

            this.contextmenus.set(contextmenu.config.name, contextmenu);
        };

        this.performance.end = performance.now();

        this.logger.success(`${this.contextmenus.size} context menus has been loaded.`, { start: this.performance.start, end: this.performance.end });
        return this.contextmenus;
    };

    /**
     * 
     * @returns {Promise<Collection<String, Button>>}
     */

    async loadButtons() {
        this.performance.start = performance.now();

        const filesPath = this.utils.getFiles('./src/Interactions/Buttons', ['.js']);
        for (const path of filesPath) {
            const button = new (require(`../../${path}`))(this);
            if (!button.run || !button.config || !button.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.buttons.set(button.config.name, button);
        };

        this.performance.end = performance.now();

        this.logger.success(`${this.buttons.size} buttons has been loaded.`, { start: this.performance.start, end: this.performance.end });
        return this.buttons;
    };

    /**
     * 
     * @returns {Promise<Collection<String, SelectMenu>>}
     */

    async loadSelectMenus() {
        this.performance.start = performance.now();

        const filesPath = this.utils.getFiles('./src/Interactions/SelectMenus', ['.js']);
        for (const path of filesPath) {
            const selectmenu = new (require(`../../${path}`))(this);
            if (!selectmenu.run || !selectmenu.config || !selectmenu.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.selectmenus.set(selectmenu.config.name, selectmenu);
        };

        this.performance.end = performance.now();

        this.logger.success(`${this.selectmenus.size} select menus has been loaded.`, { start: this.performance.start, end: this.performance.end });
        return this.selectmenus;
    };

    /**
     * 
     * @returns {Promise<Collection<String, Modal>>}
     */

    async loadModals() {
        this.performance.start = performance.now();

        const filesPath = this.utils.getFiles('./src/Interactions/Modals', ['.js']);
        for (const path of filesPath) {
            const modal = new (require(`../../${path}`))(this);
            if (!modal.run || !modal.config || !modal.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.modals.set(modal.config.name, modal);
        };

        this.performance.end = performance.now();

        this.logger.success(`${this.modals.size} modals has been loaded.`, { start: this.performance.start, end: this.performance.end });
        return this.modals;
    };

    /**
     * 
     * @returns {Promise<Collection<String, Event>>}
     */

    async loadEvents() {
        this.performance.start = performance.now();

        const filesPath = this.utils.getFiles('./src/Listeners', ['.js']);
        for (const path of filesPath) {
            const event = new (require(`../../${path}`))(this);
            if (!event.run || !event.config || !event.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.events.set(event.config.name, event);

            const target = event.config.rest ? this.rest : event.config.process ? process : this;
            target.on(event.config.name, (...args) => event.run(...args));
        };

        this.performance.end = performance.now();

        this.logger.success(`${this._eventsCount} events has been loaded.`, { start: this.performance.start, end: this.performance.end, inline: true });
        return this.events;
    };

    /**
     * 
     * @returns {Promise<true>}
     */

    async loadInteractions() {
        await this.loadCommands();
        await this.loadContextMenus();

        return true
    };
    
    /**
     *
     * @returns {Promise<false|any>}
     */

    deployClientCommands() {
        return this.application.commands.set(this.interactions).catch(() => false);
    };
    
    /**
     *
     * @returns {Promise<false|any>}
     */

    removeClientCommands() {
        return this.application.commands.set([]).catch(() => false);
    };

    /**
     * 
     * @returns {Promise<true>}
     */

    async loadAll() {
        await this.loadDatabase();
        await this.loadRestAPI();

        await this.loadCommands();
        await this.loadContextMenus();
        await this.loadButtons();
        await this.loadSelectMenus();
        await this.loadModals();
        await this.loadEvents();

        return true;
    };

    /**
     * 
     * @param {Boolean} [spinner] 
     * @returns {Promise<String|Spinner>}
     */

    async loadClient(spinner) {
        this.connection = spinner ? undefined : createSpinner(`Connecting ${this.config.username} to the Discord API...`).start();

        return this.login(this.devMode ? this.config.utils.betaToken : this.config.utils.token).catch(() => this.connection.error({ text: `${this.config.username} was unable to connect to the Discord API.` }));
    };
};