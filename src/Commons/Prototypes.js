const { GuildMember, Role, PermissionFlagsBits } = require('discord.js');

module.exports = class Prototypes {

    /**
     * 
     * @constructor
     */

    constructor() {

        /**
         * 
         * @returns {Boolean}
         */
        
        GuildMember.prototype.isAdmin = function isAdmin() {
            return this.permissions.has(PermissionFlagsBits.Administrator);
        };

        /**
         * 
         * @returns {Boolean}
         */
        
        Role.prototype.isAdmin = function isAdmin() {
            return this.permissions.has(PermissionFlagsBits.Administrator);
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