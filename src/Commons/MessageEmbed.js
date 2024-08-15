const { EmbedBuilder, Colors } = require('discord.js');

const Config = require('../Core/Config');

module.exports = class MessageEmbed extends EmbedBuilder {

    /**
     * 
     * @param {any} [data]
     * @param {Boolean} [skipValidation]
     * @constructor
     */

    constructor(data, skipValidation) {
        super(data, skipValidation);

        this.config = new Config();

        this.data.style = 'DEFAULT';
        this.data.color = this.config.embeds.color;
        this.data.footer = { text: this.config.embeds.footer, icon_url: this.config.images.logo };
    };

    /**
     * 
     * @param {'SUCCESS'|'ERROR'|'LOADING'} style
     * @returns {MessageEmbed}
     */

    setStyle(style) {
        this.data.style = style.toUpperCase();
    
        switch(this.data.style) {
            case 'SUCCESS':
                this.data.title = 'Succès';
                
                break;
            case 'ERROR':
                this.data.title = 'Erreur';
                
                break;
            case 'LOADING':
                this.data.title = 'Chargement';
                
                break;
        };
    
        return this;
    };

    /**
     * 
     * @param {string} description
     * @returns {MessageEmbed}
     */    

    setDescription(description) {
        switch(this.data.style) {
            case 'SUCCESS':
                this.data.description = `${this.config.emojis.yes} ${description}`;
                this.data.color = Colors.Green;
                
                break;
            case 'ERROR':
                this.data.description = `${this.config.emojis.no} ${description}`;
                this.data.color = Colors.Red;
                
                break;
            case 'LOADING':
                this.data.description = `${this.config.emojis.loading} ${description}`;
                this.data.color = Colors.DarkerGrey;
                
                break;
        };
    
        if (!this.data.style || this.data.style === 'DEFAULT') this.data.description = description;
    
        return this;
    };
};