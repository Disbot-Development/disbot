const { PermissionFlagsBits } = require('discord.js');

const Bot = require('../../Managers/Bot');
const Base = require('./Base');

module.exports = class Button extends Base {

    /**
     * 
     * @typedef {Object} ButtonConfig
     * @property {String} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @param {Bot} client
     * @param {ButtonConfig} config
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