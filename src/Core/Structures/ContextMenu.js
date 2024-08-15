const { PermissionFlagsBits } = require('discord.js');

const Bot = require('../Bot');
const Base = require('./Base');

module.exports = class ContextMenu extends Base {

    /**
     * 
     * @typedef {Object} ContextMenuConfig
     * @property {String} name
     * @property {Number} type
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @param {Bot} client
     * @param {ContextMenuConfig} config
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