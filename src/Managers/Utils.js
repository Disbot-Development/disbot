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
};