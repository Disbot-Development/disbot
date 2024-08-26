const { PermissionFlagsBits } = require('discord.js');

const Base = require('./Base');
const Bot = require('../Bot');

module.exports = class Modal extends Base {

    /**
     * 
     * @typedef {Object} ModalConfig
     * @property {String} name
     * @property {PermissionFlagsBits[]} perms
     * @property {PermissionFlagsBits[]} meperms
     */

    /**
     * 
     * @param {Bot} client
     * @param {ModalConfig} config
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