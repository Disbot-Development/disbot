const Base = require('./Base');
const client = require('../../../index');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class Button extends Base {

    /**
     * The button config.
     * @typedef {Object} ButtonConfig
     * @property {String} name The name
     * @property {PermissionFlagsBits[]} perms The permissions
     * @property {PermissionFlagsBits[]} meperms The client permissions
     */

    /**
     * The Button constructor.
     * @param {client} client The client
     * @param {ButtonConfig} config The config
     * @constructor
     */
    
    constructor(client, {
        name = null,
        perms = null,
        meperms = null
    }) {
        super(client);

        this.config = {
            name,
            perms,
            meperms
        };
    };
};