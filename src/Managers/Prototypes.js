const Discord = require('discord.js');
const client = require('../../index');

module.exports = class Prototypes {

    /**
     * 
     * @param {client} client
     * @constructor
     */

    constructor(client) {

        /**
         * 
         * @returns {Boolean}
         */
        
        Discord.GuildMember.prototype.isAdmin = function isAdmin() {
            return this.permissions.has(Discord.PermissionFlagsBits.Administrator);
        };

        /**
         * 
         * @returns {Boolean}
         */
        
        Discord.Role.prototype.isAdmin = function isAdmin() {
            return this.permissions.has(Discord.PermissionFlagsBits.Administrator);
        };

        /**
         * 
         * @param {number} seconds
         * @returns {Date}
         */

        Date.prototype.addSeconds = function addSeconds(seconds) {
            this.setTime(this.getTime() + (seconds * 1000));

            return this;
        };

        /**
         * 
         * @param {number} minutes
         * @returns {Date}
         */

        Date.prototype.addMinutes = function addMinutes(minutes) {
            this.setTime(this.getTime() + (minutes * 60 * 1000));

            return this;
        };
    };
};