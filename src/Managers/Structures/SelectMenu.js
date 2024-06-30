const Base = require('./Base');
const client = require('../../../index');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class SelectMenu extends Base {

    /**
     * The SelectMenu config.
     * @typedef {object} SelectMenuConfig
     * @property {string} name The name
     * @property {PermissionFlagsBits[]} perms The permissions
     * @property {PermissionFlagsBits[]} meperms The client permissions
     */

    /**
     * The SelectMenu constructor.
     * @param {client} client The client
     * @param {SelectMenuConfig} config The config
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