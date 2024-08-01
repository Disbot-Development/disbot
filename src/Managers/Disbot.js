const { Client, Collection, PermissionFlagsBits, ApplicationCommandOption, ApplicationCommandType } = require('discord.js');
const { createSpinner } = require('nanospinner');
const { QuickDB } = require('quick.db');

const BackupScheduler = require('./BackupScheduler');
const Prototypes = require('./Prototypes');
const RestAPI = require('./RestAPI');
const Config = require('./Config');
const Logger = require('./Logger');
const Utils = require('./Utils');

module.exports = class Disbot extends Client {

    /**
     * 
     * @param {Client.options} options
     * @constructor
     */

    constructor(options) {
        super(options);

        new Prototypes(this);
    };
    
    utils = new Utils(this);
    config = new Config();
    logger = new Logger();

    /**
     * 
     * @typedef {object} CommandConfig
     * @property {string} name
     * @property {string} description 
     * @property {'administrator'|'developer'|'information'|'management'|'moderation'|'util'} category
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     * @property {ApplicationCommandOption[]} options
     */

    /**
     * 
     * @typedef {object} Command
     * @property {CommandConfig} config
     */

    /**
     * 
     * @type {Collection<string, Command>}
     */

    commands = new Collection();

    /**
     * 
     * @typedef {object} ButtonConfig
     * @property {string} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {object} Button
     * @property {ButtonConfig} config
     */

    /**
     * @type {Collection<string, Button>}
     */

    buttons = new Collection();
    
    /**
     * 
     * @typedef {object} SelectMenuConfig
     * @property {string} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {object} SelectMenu
     * @property {SelectMenuConfig} config
     */

    /**
     * @type {Collection<string, SelectMenu>}
     */

    selectmenus = new Collection();

    /**
     * 
     * @typedef {object} ModalConfig
     * @property {string} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {object} Modal
     * @property {ModalConfig} config
     */

    /**
     * @type {Collection<string, Modal>}
     */

    modals = new Collection();

    /**
     * 
     * @typedef {object} ContextMenuConfig
     * @property {string} name
     * @property {ApplicationCommandType} type
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @typedef {object} ContextMenu
     * @property {ContextMenuConfig} config
     */

    /**
     * @type {Collection<string, ContextMenu>}
     */

    contextmenus = new Collection();

    /**
     * @returns {Collection<string, CommandConfig|ContextMenuConfig>}
     */

    get interactions() {
        return [].concat(this.commands.map((command) => command.config), this.contextmenus.map((contextmenu) => contextmenu.config));
    };

    /**
     * 
     * @returns {true}
     */

    loadDatabase() {
        this.database = new QuickDB();

        this.logger.success('The database was linked.');

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadRestAPI() {
        this.restapi = new RestAPI(this);

        this.restapi.start();

        this.logger.success('The Rest API was loaded.');

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadBackupScheduler() {
        this.scheduler = new BackupScheduler(this, 'json.sqlite', 'backups');
        this.scheduler.scheduleBackup();

        this.logger.success('The backup scheduler is running.');

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadCommands() {
        const filesPath = this.utils.getFiles('./src/Interactions/Commands', ['.js']);

        for (const path of filesPath) {
            const command = new (require(`../../${path}`))(this);

            if (!command.run || !command.config || !command.config.name || !command.config.description) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.commands.set(command.config.name, command);
        };

        this.logger.success(`${this.commands.size} Commands has been loaded.`);
    
        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadButtons() {
        const filesPath = this.utils.getFiles('./src/Interactions/Buttons', ['.js']);

        for (const path of filesPath) {
            const button = new (require(`../../${path}`))(this);

            if (!button.run || !button.config || !button.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.buttons.set(button.config.name, button);
        };

        this.logger.success(`${this.buttons.size} Buttons has been loaded.`);
    
        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadSelectMenus() {
        const filesPath = this.utils.getFiles('./src/Interactions/SelectMenus', ['.js']);

        for (const path of filesPath) {
            const selectmenu = new (require(`../../${path}`))(this);

            if (!selectmenu.run || !selectmenu.config || !selectmenu.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.selectmenus.set(selectmenu.config.name, selectmenu);
        };

        this.logger.success(`${this.selectmenus.size} SelectMenus has been loaded.`);

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadModals() {
        const filesPath = this.utils.getFiles('./src/Interactions/Modals', ['.js']);

        for (const path of filesPath) {
            const modal = new (require(`../../${path}`))(this);

            if (!modal.run || !modal.config || !modal.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.modals.set(modal.config.name, modal);
        };

        this.logger.success(`${this.modals.size} Modals has been loaded.`);
    
        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadContextMenus() {
        const filesPath = this.utils.getFiles('./src/Interactions/ContextMenus', ['.js']);

        for (const path of filesPath) {
            const contextmenu = new (require(`../../${path}`))(this);

            if (!contextmenu.run || !contextmenu.config || !contextmenu.config.name || !contextmenu.config.type) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]} doesn't have required data.`);

            this.contextmenus.set(contextmenu.config.name, contextmenu);
        };

        this.logger.success(`${this.contextmenus.size} ContextMenus has been loaded.`);
    
        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadEvents() {
        const filesPath = this.utils.getFiles('./src/Listeners', ['.js']);

        for (const path of filesPath) {
            const event = new (require(`../../${path}`))(this);

            if (!event.run || !event.config || !event.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            const parentFolder = path.match(/\w{0,255}\/(\w{0,252}\.js)$/g)[0].split('/')[0];

            if (event.config.name === 'rateLimited') this.rest.on(event.config.name, (...args) => event.run(...args));
            else if (parentFolder === 'Process') process.on(event.config.name, (...args) => event.run(...args));
            else this.on(event.config.name, (...args) => event.run(...args));
        };

        this.logger.success(`${this._eventsCount} Events has been loaded.\n`);
    
        return true;
    };

    /**
     * 
     * @returns {Promise<any>}
     */

    deployClientCommands() {
        return this.application.commands.set(this.interactions);
    };

    /**
     * 
     * @returns {Promise<any>}
     */

    removeClientCommands() {
        return this.application.commands.set([]);
    };

    /**
     * 
     * @param {Boolean} spinner 
     * @returns {Promise<string>}
     */

    loadClient(spinner) {
        this.connection = spinner ? undefined : createSpinner('Connecting Disbot to the Discord API...').start();

        return this.login(this.config.utils.token);
    };

    /**
     * 
     * @returns {Promise<string>}
     */

    async init() {
        this.loadDatabase();
        this.loadRestAPI();
        this.loadBackupScheduler();

        this.loadButtons();
        this.loadCommands();
        this.loadContextMenus();
        this.loadModals();
        this.loadSelectMenus();
        this.loadEvents();

        return this.loadClient();
    };
};