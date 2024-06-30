const { CommandInteraction } = require('discord.js');
const { readdirSync, statSync } = require('fs');
const MessageEmbed = require('./MessageEmbed');
const { generate } = require('randomstring');
const client = require('../../index');

module.exports = class Utils {

    /**
     * 
     * @param {client} client
     * @constructor
     */

    constructor(client) {
        this.client = client;
    };

    /**
     * 
     * @param {number} timeout
     * @returns {Promise<setTimeout>}
     */

    wait(timeout) {
        return new Promise((res) => setTimeout(res, timeout));
    };

    /**
     * 
     * @param {string} path
     * @returns {string[]}
     */

    getFiles(path) {

        const files = readdirSync(path);

        let result = [];

        for (const file of files) {
            const filePath = `${path}/${file}`;

            if (statSync(filePath).isDirectory()) result = result.concat(this.getFiles(filePath));
            else result.push(filePath);
        };

        return result;
    };

    /**
     * 
     * @param {number} length
     */

    generateRandomChars(length) {
        const password = generate({
            length: length,
            charset: 'alphanumeric',
            capitalization: undefined
        });

        return password
    };
    
    /**
     * 
     * @param {CommandInteraction} interaction
     * @param {number} length
     * @param {'lowercase'|'uppercase'|undefined} capitalization
     * @param {String|String[]|'alphanumeric'|'alphabetic'|'numeric'|'hex'|'binary'|'octal'|undefined} type
     * @returns {string}
     */

    generatePassword(interaction, length, capitalization, type) {
        const password = generate({
            length: length,
            charset: type,
            capitalization: capitalization
        });

        interaction.update({
            embeds: [
                new MessageEmbed()
                .setTitle('Mot-de-passe')
                .setDescription(`Voici votre mot-de-passe: ||${password}||.`)
            ],
            ephemeral: true
        });
    };
    
    /**
     * 
     * @param {number} bytes
     * @returns {string}
     */
     
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';

        const size = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${size[i]}`;
    };
    
    /**
     * 
     * @param {string} str
     * @returns {string}
     * 
     */
     
    capitalizeFirstLetter(str) {
        return str[0].toUpperCase() + str.slice(1);
    };
};