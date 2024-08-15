const { PermissionFlagsBits } = require('discord.js');

const Bot = require('../Bot');
const Base = require('./Base');

module.exports = class SelectMenu extends Base {

    /**
     * 
     * @typedef {Object} SelectMenuConfig
     * @property {String} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @param {Bot} client
     * @param {SelectMenuConfig} config
     * @constructor
     */

    constructor(client, {
        name = null,
        perms = null,
        meperms = null,
    }) {
        super(client)

        this.config = {
            name,
            perms,
            meperms
        };
    };
};