const Base = require('./Base');
const client = require('../../../index');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class ContextMenu extends Base {

    /**
     * The ContextMenu config.
     * @typedef {Object} ContextMenuConfig
     * @property {String} name The name
     * @property {Number} type The type
     * @property {PermissionFlagsBits[]} perms The permissions
     * @property {PermissionFlagsBits[]} meperms The client permissions
     */

    /**
     * The ContextMenu constructor.
     * @param {client} client The client
     * @param {ContextMenuConfig} config The config
     * @constructor
     */

    constructor(client, {
        name = null,
        type = null,
        perms = null,
        meperms = null
    }) {
        super(client);

        this.config = {
            name,
            type,
            perms,
            meperms
        };
    };
};