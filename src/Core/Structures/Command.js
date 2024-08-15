const { ApplicationCommandOption, PermissionFlagsBits } = require('discord.js');

const Bot = require('../Bot');
const Base = require('./Base');

module.exports = class Command extends Base {

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
     * @param {Bot} client
     * @param {CommandConfig} config
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