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

    backupDatabase() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupPath = join(this.backupDir, `backup-${timestamp}.sqlite`);

        return copyFile(this.dbPath, backupPath, (error) => {
            if (error) this.client.logger.error(`Error during database backup: ${error}\n`);
            else console.log(`Database backup successful: ${backupPath}\n`);
        });
    };

    scheduleBackup() {
        cron.schedule('0 1 * * *', () => this.backupDatabase, { timezone: 'Europe/Paris' });
    };
};