const { Message, EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder, ComponentType } = require('discord.js');

module.exports = class Pagination {
    constructor() {
        this.context = null;
        this.pagination = null;

        this.pages = [];
        this.buttons = null;
        this.emojis = ['⬅️', '➡️'];
        this.timeout = null;
        this.style = ButtonStyle.Primary;

        this.index = 0;
        this.filter = (i) => i.user.id === (this.context.author?.id || this.context.user?.id);
        this.started = false;
        this.ended = false;
        this.deleted = false;
    };

    /**
     * @private
     * @returns {EmbedBuilder}
     */

    get currentEmbed() {
        return this.pages[this.index];
    };

    /**
     * @private
     * @returns {Boolean}
     */

    get isEditable() {
        return this.pagination.editable;
    };

    /**
     * @private
     * @returns {Boolean}
     */

    get isDeletable() {
        return this.pagination.deletable;
    };

    /**
     * 
     * @param {Array} array
     * @param {String} type
     * @returns {Boolean}
     */

    static verifTypeArray(array, type) {
        if (!array) throw new RangeError('[UTIL] Array not provided');
        if (!type) throw new RangeError('[UTIL] Type not provided.');
        if (!Array.isArray(array) || !array.length) throw new TypeError('[UTIL] Array must be a non-empty array.');

        const result = array.every((e) => {
            if (typeof e === type) return true;
            else return false;
        });

        return result;
    };

    /**
     * 
     * @param {Object} object
     * @param {String} type
     * @returns {Boolean}
     */

    static verifType(object, type) {
        if (!object) throw new RangeError('[UTIL] Object not provided');
        if (!type) throw new RangeError('[UTIL] Type not provided.');

        const result = typeof object === type;

        return result;
    };

    /**
     * 
     * @private
     * @returns {Pagination}
     */

    _fixPages() {
        if (this.ended || this.deleted) return;

        this.pages.forEach((p) => p.setFooter({ text: `Page: ${this.index + 1}/${this.pages.length}` }));

        return this;
    };

    /**
     * 
     * @private
     * @returns {Pagination}
     */

    _fixButtons() {
        if (this.ended || this.deleted) return;

        if (!this.index) this.buttons.components[0].setDisabled(true)
        else this.buttons.components[0].setDisabled(false);

        if (this.index === this.pages.length - 1) this.buttons.components[1].setDisabled(true)
        else this.buttons.components[1].setDisabled(false);

        return this;
    };

    /**
     * 
     * @returns {Message}
     */

    update() {
        if (this.deleted) return;
        
        this._fixPages();
        this._fixButtons();

        if (this.isEditable) return this.pagination.edit({embeds: [this.currentEmbed], components: [this.buttons]})
        .catch();
    };

    /**
     * 
     * @returns {Message}
     */

    previous() {
        --this.index;

        return this.update();
    };

    /**
     * 
     * @returns {Message}
     */

    next() {
        ++this.index;

        return this.update();
    };

    /**
     * 
     * @returns {Pagination}
     */

    end() {
        if (this.ended) throw new Error('[PAGINATION] Pagination is already ended.');

        this.ended = true;

        this.buttons.components.forEach((b) => b.setDisabled(true));

        return this.update();
    };

    /**
     * 
     * @returns {Message}
     */

    delete() {
        if (this.deleted) throw new Error('[PAGINATION] Pagination is already deleted.');

        this.deleted = true;
        this.ended = true;

        if (this.isDeletable) return this.pagination.delete()
        .catch();
    };

    /**
     * 
     * @param {Array} pages
     * @returns {Pagination}
     */

    setPages(pages) {
        if (!pages) throw new RangeError('[PAGINATION] Pages not provided.');
        if (!Array.isArray(pages) || !pages.length) throw new TypeError('[PAGINATION] Pages must be a non-empty array of EmbedBuilder.');

        this.pages = pages;

        return this;
    };

    /**
     * 
     * @param {EmbedBuilder} page
     * @returns {Pagination}
     */

    addPage(page) {
        if (!page) throw new RangeError('[PAGINATION] Page not provided.');

        this.setPages([...this.pages, page]);

        return this;
    };

    /**
     * 
     * @param {Array} pages
     * @returns {Pagination}
     */

    addPages(pages) {
        if (!pages) throw new RangeError('[PAGINATION] Pages not provided.');
        if (!Array.isArray(pages) || !pages.length) throw new TypeError('[PAGINATION] Pages must be a non-empty array of EmbedBuilder.');

        pages.forEach((p) => this.addPage(p));

        return this;
    };

    /**
     * 
     * @param {String[]} emojis
     * @returns {Pagination}
     */

    setEmojis(emojis) {
        if (!emojis) throw new RangeError('[PAGINATION] Emojis not provided.');
        if (!Array.isArray(emojis) || !emojis.length || !this.verifTypeArray(emojis, 'string') || !emojis[0] || !emojis[1]) throw new TypeError('[PAGINATION] Emojis must be a non-empty array of string.');
        if (emojis[3]) throw new TypeError('[PAGINATION] Exactly 2 emojis required.');

        this.emojis = emojis;

        return this;
    };

    /**
     * 
     * @param {Number} timeout
     * @returns {Pagination}
     */

    setTimeout(timeout) {
        if (!timeout) throw new RangeError('[PAGINATION] Timeout not provided.');
        if (isNaN(timeout)) throw new TypeError('[PAGINATION] Timeout must be a number.');

        this.timeout = timeout;
        
        return this;
    };

    /**
     * 
     * @param {Number} timeout
     * @returns {Pagination}
     */

    addTimeout(timeout) {
        if (!timeout) throw new RangeError('[PAGINATION] Timeout not provided.');
        if (isNaN(timeout)) throw new TypeError('[PAGINATION] Timeout must be a number.');

        this.timeout += timeout;
        
        return this;
    };

    /**
     * 
     * @param {String} style
     * @returns {Pagination}
     */

    setStyle(style) {
        if (!style) throw new RangeError('[PAGINATION] Style not provided.');
        if (!this.verifType(style, 'string')) throw new TypeError('[PAGINATION] Style must be a non-empty string. ("PRIMARY", "SECONDARY", "SUCCESS", "DANGER")');
        if (!['PRIMAY', 'SECONDARY', 'SUCCESS', 'DANGER'].includes(style.toUpperCase())) throw new TypeError('[PAGINATION] Style must be a non-empty string. ("PRIMARY", "SECONDARY", "SUCCESS", "DANGER")');

        this.style = style.toUpperCase();

        return this;
    };

    /**
     * 
     * @param {Message||Interaction} ctx
     * @returns {Pagination}
     */
    
    async start(ctx) {
        if (!ctx) throw new RangeError('[PAGINATION] Context not provided.');
        if (!ctx.channel) throw new RangeError('[PAGINATION] Context channel isn\'t in the cache.');
        if (!this.pages) throw new RangeError('[PAGINATION] Pages not provided.');
        if (this.started) throw new Error('[PAGINATION] Pagination is already started.');

        this._fixPages();
        this.context = ctx;
        this.started = true;

        this.buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setEmoji(this.emojis[0])
            .setCustomId('left')
            .setStyle(this.style)
            .setDisabled(true),
            new ButtonBuilder()
            .setEmoji(this.emojis[1])
            .setCustomId('right')
            .setStyle(this.style)
            .setDisabled(this.pages.length <= 1)
        );

        const msg = await this.context.reply({ embeds: [this.pages[this.index]], components: [this.buttons], fetchReply: true })
        .catch();
        
        this.pagination = msg;
        
        const collector = msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: this.filter,
            time: this.timeout
        });
        
        collector.on('collect', i => {
            if (this.deleted || this.ended) return;
            
            i.deferUpdate();
    
            switch (i.customId) {
                case 'left':
                    this.previous();
                break;
                case 'right':
                    this.next();
                break;
            };
        });

        collector.on('end', () => {
            this.end();
        });
        
        return this;
    };
};