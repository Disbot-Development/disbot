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
         * @param {string} key
         * @returns {any}
         */

        Discord.Client.prototype.getData = function getData(key) {
            return client.database.get(key);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */

        Discord.Client.prototype.setData = function setData(key, value) {
            return client.database.set(key, value);
        };

        /**
         * 
         * @param {string} key
         * @returns {boolean}
         */

        Discord.Client.prototype.removeData = function removeData(key) {
            return client.database.delete(key);
        };

        /**
         * 
         * @param {string} key
         * @param {number} value
         * @returns {any}
         */

        Discord.Client.prototype.addData = function addData(key, value) {
            return client.database.add(key, value);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.Client.prototype.pushData = function pushData(key, value) {
            if (!Array.isArray(client.database.get(key))) return client.database.set(key, [value]);
        
            if (client.database.get(key).includes(value)) return;
        
            return client.database.push(key, value);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.Client.prototype.filterData = function filterData(key, value) {
            if (!Array.isArray(client.database.get(key))) return;
        
            const newValue = client.database.get(key).filter((v) => v !== value);
            
            return this.setData(key, newValue);
        };

        /**
         * 
         * @param {string} key
         * @returns {any}
         */
        
        Discord.Guild.prototype.getData = function getData(key) {
            return client.database.get(`${this.id}.${key}`);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.Guild.prototype.setData = function setData(key, value) {
            return client.database.set(`${this.id}.${key}`, value);
        };

        /**
         * 
         * @param {string} key
         * @returns {boolean}
         */
        
        Discord.Guild.prototype.removeData = function removeData(key) {
            return client.database.delete(`${this.id}.${key}`);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.Guild.prototype.addData = function addData(key, value) {
            return client.database.add(`${this.id}.${key}`, value);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.Guild.prototype.subtractData = function subtractData(key, value) {
            return client.database.subtract(`${this.id}.${key}`, value);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.Guild.prototype.pushData = function pushData(key, value) {
            if (!Array.isArray(this.getData(key))) return this.setData(key, [value]);
        
            if (this.getData(key).includes(value)) return;
        
            return client.database.push(`${this.id}.${key}`, value);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.Guild.prototype.filterData = function filterData(key, value) {
            if (!Array.isArray(this.getData(key))) return;
        
            const newValue = this.getData(key).filter((v) => v !== value);
            
            return this.setData(key, newValue);
        };

        /**
         * 
         * @returns {array}
         */
        
        Discord.Guild.prototype.getModules = function getModules() {
            return this.getData('modules') || [];
        };

        /**
         * 
         * @param {string} modules
         * @returns {any}
         */
        
        Discord.Guild.prototype.addModule = function addModule(modules) {
            return this.pushData('modules', modules);
        };

        /**
         * 
         * @param {string} modules
         * @returns {any}
         */
        
        Discord.Guild.prototype.removeModule = function removeModule(modules) {
            return this.filterData('modules', modules);
        };

        /**
         * 
         * @param {string} key
         * @returns {any}
         */
        
        Discord.GuildMember.prototype.getData = function getData(key) {
            return this.guild.getData(`users.${this.id}.${key}`);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.GuildMember.prototype.setData = function setData(key, value) {
            return this.guild.setData(`users.${this.id}.${key}`, value);
        };
        
        /**
         * 
         * @param {string} key
         * @returns {boolean}
         */
        
        Discord.GuildMember.prototype.removeData = function removeData(key) {
            return this.guild.removeData(`users.${this.id}.${key}`);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.GuildMember.prototype.addData = function addData(key, value) {
            return this.guild.addData(`users.${this.id}.${key}`, value);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.GuildMember.prototype.subtractData = function subtractData(key, value) {
            return this.guild.subtractData(`users.${this.id}.${key}`, value);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.GuildMember.prototype.pushData = function pushData(key, value) {
            return this.guild.pushData(`users.${this.id}.${key}`, value);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.GuildMember.prototype.filterData = function filterData(key, value) {
            if (!Array.isArray(this.guild.getData(`users.${this.id}.${key}`))) return;
        
            const newValue = this.guild.getData(`users.${this.id}.${key}`).filter((v) => v !== value);

            return this.guild.filterData(`users.${this.id}.${key}`, newValue);
        };

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
         * @param {string} key
         * @returns {any}
         */
        
        Discord.User.prototype.getData = function getData(key) {
            return this.client.getData(`${this.id}.${key}`);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.User.prototype.setData = function setData(key, value) {
            return this.client.setData(`${this.id}.${key}`, value);
        };

        /**
         * 
         * @param {string} key
         * @returns {boolean}
         */
        
        Discord.User.prototype.removeData = function removeData(key) {
            return this.client.removeData(`${this.id}.${key}`);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.User.prototype.addData = function addData(key, value) {
            return this.client.addData(`${this.id}.${key}`, value);
        };

        /**
         * 
         * @param {string} key
         * @param {any} value
         * @returns {any}
         */
        
        Discord.User.prototype.subtractData = function subtractData(key, value) {
            return this.client.subtractData(`${this.id}.${key}`, value);
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