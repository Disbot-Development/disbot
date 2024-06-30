const Base = require('./Base');
const client = require('../../../index');
const { ApplicationCommandOption, PermissionFlagsBits } = require('discord.js');

module.exports = class Command extends Base {

    /**
     * The Command config.
     * @typedef {object} CommandConfig
     * @property {string} name The name
     * @property {string} description The description
     * @property {'administrator'|'developer'|'information'|'management'|'moderation'|'util'} category The category
     * @property {PermissionFlagsBits[]} perms The permissions
     * @property {PermissionFlagsBits[]} meperms The client permissions
     * @property {ApplicationCommandOption[]} options The options
     */

    /**
     * The Command constructor.
     * @param {client} client The client
     * @param {CommandConfig} config The config
     * @constructor
     */
    
    constructor(client, {
        name = null,
        description = null,
        category = null,
        perms = null,
        meperms = null,
        options = null
    }) {
        super(client);
        
        this.config = {
            name,
            description,
            category,
            perms,
            meperms,
            options
        };
    };
};