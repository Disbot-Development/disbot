const { readdirSync, statSync } = require('fs');
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
     * @param {Number} timeout
     * @returns {Promise<setTimeout>}
     */

    wait(timeout) {
        return new Promise((res) => setTimeout(res, timeout));
    };

    /**
     * 
     * @param {String} path
     * @returns {String[]}
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
     * @param {Number} bytes
     * @returns {String}
     */
     
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';

        const size = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        
        return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${size[i]}`;
    };
    
    /**
     * 
     * @param {String} str
     * @returns {String}
     */
     
    capitalizeFirstLetter(str) {
        return str[0].toUpperCase() + str.slice(1);
    };

    /**
     * 
     * @param {Object} options
     * @param {Number} [options.length=16] 
     * @param {Boolean} [options.lowercase=false]
     * @param {Boolean} [options.uppercase=false]
     * @param {Boolean} [options.numbers=false]
     * @param {Boolean} [options.symbols=false]
     * @returns {String}
     */
    
    generateRandomChars({ length = 16, lowercase = false, uppercase = false, numbers = false, symbols = false }) {
        const options = [
            { enabled: lowercase, chars: 'abcdefghijklmnopqrstuvwxyz' },
            { enabled: uppercase, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
            { enabled: numbers, chars: '0123456789' },
            { enabled: symbols, chars: '!@#$%^&*()+_-=}{[]|:;"/?.><,`~' }
        ];

        let characters = '';
        options.forEach((option) => {
            if (option.enabled) characters += option.chars;
        });
    
        return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
    };

    /**
     * 
     * @param {String[]} arr 
     * @param {String} conjunction 
     * @param {String} lastConjunction 
     * @returns {String}
     */

    joinCustomLastWord(arr, conjunction = ', ', lastConjunction = ' et ') {
        if (arr.length === 0) return '';
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return arr.join(lastConjunction);
      
        const allButLast = arr.slice(0, -1).join(conjunction);
        const last = arr[arr.length - 1];
        return `${allButLast}${lastConjunction}${last}`;
    };

    /**
     * 
     * @returns {Number}
     */

    getAllUsers() {
        return this.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    };
};