const { Client, Collection, PermissionFlagsBits, ApplicationCommandOption, ApplicationCommandType, version } = require('discord.js');
const { createSpinner } = require('nanospinner');
const Prototypes = require('./Prototypes');
const Config = require('./Config');
const Utils = require('./Utils');
const Logger = require('./Logger');
const Database = require('quick.db');

module.exports = class Disbot extends Client {

    /**
     * 
     * @param {Client.options} options
     * @constructor
     */

    constructor(options) {
        super(options);

        new Prototypes(this)
    };

    config = new Config(this);
    utils = new Utils(this);
    logger = new Logger(this);

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
     * @param {boolean} logging
     * @returns {true}
     */

    verifications(logging) {
        if (version !== require('../../package.json').dependencies['discord.js'].replace(/\^/g, '')) this.logger.throw(`Discord.JS -> Needed version: ${require('../../package.json').dependencies['discord.js']}`);
        if (this.database.version !== require('../../package.json').dependencies['quick.db'].replace(/\^/g, '')) this.logger.throw(`Quick.DB -> Needed version: ${require('../../package.json').dependencies['discord.js']}`);

        if (!this.commands) this.logger.throw('Commands -> Property not found.');
        if (!this.buttons) this.logger.throw('Buttons -> Property not found.');
        if (!this.selectmenus) this.logger.throw('SelectMenus -> Property not found.');
        if (!this.modals) this.logger.throw('Modals -> Property not found.');
        if (!this.contextmenus) this.logger.throw('ContextMenus -> Property not found.');
        if (!this.config) this.logger.throw('Config -> Property not found.');
        if (!this.utils) this.logger.throw('Utils -> Property not found.');
        if (!this.database) this.logger.throw('Database -> Property not found.');
        
        if (!logging) {
            this.logger.success(`All the necessary checks have been carried out.`);
        };

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadDatabase() {
        this.database = Database;

        this.logger.success('The database was linked.');

        return true;
    };

    /**
     * 
     * @param {boolean} logging
     * @returns {true}
     */

    loadCommands(logging) {
        const filesPath = this.utils.getFiles('./src/Interactions/Commands');

        for (const path of filesPath) {
            const command = new (require(`../../${path}`))(this);

            if (!command.run || !command.config || !command.config.name || !command.config.description) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.commands.set(command.config.name, command);
        };

        if (!logging) {
            this.logger.success(`${this.commands.size} Commands has been loaded.`);
        };
    
        return true;
    };

    /**
     * 
     * @param {boolean} logging
     * @returns {true}
     */

    loadButtons(logging) {
        const filesPath = this.utils.getFiles('./src/Interactions/Buttons');

        for (const path of filesPath) {
            const button = new (require(`../../${path}`))(this);

            if (!button.run || !button.config || !button.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.buttons.set(button.config.name, button);
        };

        if (!logging) {
            this.logger.success(`${this.buttons.size} Buttons has been loaded.`);
        };
    
        return true;
    };

    /**
     * 
     * @param {boolean} logging
     * @returns {true}
     */

    loadSelectMenus(logging) {
        const filesPath = this.utils.getFiles('./src/Interactions/SelectMenus');

        for (const path of filesPath) {
            const selectmenu = new (require(`../../${path}`))(this);

            if (!selectmenu.run || !selectmenu.config || !selectmenu.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.selectmenus.set(selectmenu.config.name, selectmenu);
        };

        if (!logging) {
            this.logger.success(`${this.selectmenus.size} SelectMenus has been loaded.`);
        };

        return true;
    };

    /**
     * 
     * @param {boolean} logging
     * @returns {true}
     */

    loadModals(logging) {
        const filesPath = this.utils.getFiles('./src/Interactions/Modals');

        for (const path of filesPath) {
            const modal = new (require(`../../${path}`))(this);

            if (!modal.run || !modal.config || !modal.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            this.modals.set(modal.config.name, modal);
        };

        if (!logging) {
            this.logger.success(`${this.modals.size} Modals has been loaded.`);
        };
    
        return true;
    };

    /**
     * 
     * @param {boolean} logging
     * @returns {true}
     */

    loadContextMenus(logging) {
        const filesPath = this.utils.getFiles('./src/Interactions/ContextMenus');

        for (const path of filesPath) {
            const contextmenu = new (require(`../../${path}`))(this);

            if (!contextmenu.run || !contextmenu.config || !contextmenu.config.name || !contextmenu.config.type) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]} doesn't have required data.`);

            this.contextmenus.set(contextmenu.config.name, contextmenu);
        };

        if (!logging) {
            this.logger.success(`${this.contextmenus.size} ContextMenus has been loaded.`);
        };
    
        return true;
    };

    /**
     * 
     * @returns {true}
     */

    loadEvents() {
        const filesPath = this.utils.getFiles('./src/Listeners');

        for (const path of filesPath) {
            const event = new (require(`../../${path}`))(this);

            if (!event.run || !event.config || !event.config.name) this.logger.throw(`The file "${path.split(/\//g)[path.split(/\//g).length - 1]}" doesn't have required data.`);

            switch (path.match(/\w{0,255}\/(\w{0,252}\.js)$/g)[0].split('/')[0]) {
                case 'Process':
                    process.on(event.config.name, (...args) => event.run(...args));
                break;
                default:
                    this.on(event.config.name, (...args) => event.run(...args));
                break;
            };
        };

        this.logger.success(`${this._eventsCount} Events has been loaded.\n`);
    
        return true;
    };

    /**
     * 
     * @returns {true}
     */

    reloadCommands() {
        this.commands.clear();
        
        const filesPath = this.utils.getFiles('./src/Interactions/Commands');

        for (const path of filesPath) {
            delete require.cache[require.resolve(`../../${path}`)];
        };

        this.loadCommands(true);

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    reloadButtons() {
        this.buttons.clear();

        const filesPath = this.utils.getFiles('./src/Interactions/Buttons');

        for (const path of filesPath) {
            delete require.cache[require.resolve(`../../${path}`)];
        };

        this.loadButtons(true);

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    reloadSelectMenus() {
        this.selectmenus.clear();
        
        const filesPath = this.utils.getFiles('./src/Interactions/SelectMenus');

        for (const path of filesPath) {
            delete require.cache[require.resolve(`../../${path}`)];
        };
        
        this.loadSelectMenus(true);

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    reloadModals() {
        this.modals.clear();
        
        const filesPath = this.utils.getFiles('./src/Interactions/Modals');

        for (const path of filesPath) {
            delete require.cache[require.resolve(`../../${path}`)];
        };

        this.loadModals(true);

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    reloadContextMenus() {
        this.contextmenus.clear();
        
        const filesPath = this.utils.getFiles('./src/Interactions/ContextMenus');

        for (const path of filesPath) {
            delete require.cache[require.resolve(`../../${path}`)];
        };

        this.loadContextMenus(true);

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    deployClientCommands() {
        this.application.commands.set(this.interactions);

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    removeAllCommands() {
        this.application.commands.set([]);
        this.guilds.cache.map((g) => g.commands.set([]));

        return true;
    };

    /**
     * 
     * @returns {true}
     */

    reloadAll() {
        const spinner = createSpinner('Reloading Disbot...').start();

        this.verifications(true);
        this.reloadButtons();
        this.reloadCommands();
        this.reloadContextMenus();
        this.reloadModals();
        this.reloadSelectMenus();

        spinner.success({ text: 'Disbot has been reloaded.\n' });

        return true;
    };

    /**
     * 
     * @param {boolean} logging
     * @returns {Promise<true>}
     */

    loadClient(logging) {
        if (!logging) {
            this.connection = createSpinner('Connecting Disbot to the Discord API...').start();
        };

        this.login(this.config.utils.token);

        return new Promise(() => true);
    };

    /**
     * 
     * @returns {true}
     */

    async init() {
        this.loadDatabase();
        
        this.verifications();

        this.loadButtons();
        this.loadCommands();
        this.loadContextMenus();
        this.loadModals();
        this.loadSelectMenus();
        this.loadEvents();

        await this.utils.wait(100);

        this.loadClient();

        return true;
    };
};