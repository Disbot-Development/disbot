const { readdirSync, statSync, readFileSync } = require('fs');
const { relative, sep } = require('path');

const Bot = require('../Core/Bot');

module.exports = class Utils {

    /**
     * 
     * @param {Bot} client
     * @constructor
     */

    constructor(client) {
        this.client = client;
    };

    /**
     * 
     * @namespace CharSet
     */

    CharSet = {
        UpperCase: 1,
        LowerCase: 2,
        Numerical: 4,
        Symbols: 8
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
     * @param {String[]} [extensions]
     * @returns {String[]}
     */

    getFiles(path, extensions = []) {
        const files = readdirSync(path);
        let result = [];

        for (const file of files) {
            const filePath = `${path}/${file}`;

            if (statSync(filePath).isDirectory()) result = result.concat(this.getFiles(filePath, extensions));
            else if (!extensions.length || extensions.some((ext) => filePath.endsWith(ext))) result.push(filePath);
        };

        return result;
    };

    /**
     * 
     * @param {String} filePath 
     * @returns {Number}
     */

    countLines(filePath) {
        const fileContent = readFileSync(filePath, 'utf8');

        return fileContent.split('\n').length;
    };

    /**
     * 
     * @param {String} dirPath 
     * @param {String[]} [extensions]
     * @param {String[]} [excludeDirs]
     * @returns {Number}
     */

    countLinesInDir(dirPath, extensions = [], excludeDirs = []) {
        const files = this.getFiles(dirPath, extensions);
        let totalLines = 0;

        for (const file of files) {
            const relativePath = relative(dirPath, file);
            const parts = relativePath.split(sep);

            const isExcluded = parts.some((part) => excludeDirs.includes(part));

            if (!isExcluded) totalLines += this.countLines(file);
        };

        return totalLines;
    };
    
    /**
     * 
     * @param {Number} bytes
     * @returns {String}
     */
     
    formatBytes(bytes) {
        if (!bytes) return '0 Bytes';

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
     * @param {String[]} arr 
     * @param {String} [conjunction] 
     * @param {String} [lastConjunction] 
     * @returns {String}
     */

    joinCustomLastWord(arr, conjunction = ', ', lastConjunction = ' et ') {
        if (!arr.length) return '';
        if (arr.length === 1) return arr[0];
        if (arr.length === 2) return arr.join(lastConjunction);
      
        const allButLast = arr.slice(0, -1).join(conjunction);
        const last = arr[arr.length - 1];

        return `${allButLast}${lastConjunction}${last}`;
    };

    /**
     * 
     * @param {Number} length
     * @param {Number} charSetOptions
     * @param {String} [additionalChars]
     * @returns {String}
     */

    generateRandomChars(length, charSetOptions, additionalChars = '') {
        let charSet = '';

        const charSetMapping = {
            [this.CharSet.UpperCase]: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            [this.CharSet.LowerCase]: 'abcdefghijklmnopqrstuvwxyz',
            [this.CharSet.Numerical]: '0123456789',
            [this.CharSet.Symbols]: '!@#$%^&*()_+~`|}{[]:;?><,./-='
        };
        
        for (const [key, value] of Object.entries(charSetMapping)) {
            if (charSetOptions & key) charSet += value;
        };

        charSet += additionalChars;

        let result = '';
        for (let i = 0; i < length; i++) { 
            result += charSet[Math.floor(Math.random() * charSet.length)];
        };

        return result;
    };
};