const Base = require('./Base');
const client = require('../../../index');
const { PermissionFlagsBits } = require('discord.js');

module.exports = class Modal extends Base {

    /**
     * The Modal config.
     * @typedef {Object} ModalConfig
     * @property {String} name The name
     * @property {PermissionFlagsBits[]} perms The permissions
     * @property {PermissionFlagsBits[]} meperms The client permissions
     */

    /**
     * The Modal constructor.
     * @param {client} client The client
     * @param {ModalConfig} config The config
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