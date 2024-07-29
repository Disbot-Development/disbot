const client = require('../../index');
const { copyFile, existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const cron = require('node-cron');

module.exports = class BackupScheduler {

    /**
     * 
     * @param {client} client
     * @param {String} dbPath
     * @param {String} backupDir
     * @constructor
     */

    constructor(client, dbPath, backupDir) {
        this.client = client;
        this.dbPath = dbPath;
        this.backupDir = backupDir;

        if (!existsSync(this.backupDir)) mkdirSync(this.backupDir);
    };

    /**
     * 
     * @returns {Boolean}
     */

    backupDatabase() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = join(this.backupDir, `backup-${timestamp}.sqlite`);

        copyFile(this.dbPath, backupPath, (error) => {
            if (error) {
                this.client.logger.error(`Error during database backup: ${error}\n`);

                return true;
            } else {
                this.client.logger.success(`Database backup successful: ${backupPath}\n`);

                return false;
            };
        });
    };

    scheduleBackup() {
        cron.schedule('0 1 * * *', () => { this.backupDatabase() }, { timezone: 'Europe/Paris' });
    };
};