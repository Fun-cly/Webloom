import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import * as fs from 'fs/promises';

import { CRAWL_SETTINGS } from '../config/crawlerSettings';

export class Database {
    constructor(dbPath = CRAWL_SETTINGS.DB_PATH) {
        this.dbPath = dbPath;
        this.db = null;
    }
    async connect() {
        this.db = await open({
            filename: this.dbPath,
            driver: sqlite3.Database
        });
        const schemaSQL = await fs.readFile('./sql/schema.sql', 'utf-8')
        const indexSQL = await fs.readFile('./sql/indexes.sql', 'utf-8')
        await this.db.exec(schemaSQL);
        await this.db.exec(indexSQL)
        console.log(`Connected to SQLite database at ${this.dbPath}`);
    }
    async getSite(url) {
        if (!this.db) throw new Error("Database not connected.");

        const domain = new URL(url).hostname;
        const result = await this.db.get('SELECT * FROM sites WHERE domain = ?', domain)

        return result
    }
    async getUncrawledPages(site_id) {
        if (!this.db) throw new Error("Database not connected.");
        const result = await this.db.all('SELECT * FROM pages WHERE site_id = ?', site_id)

        return result
    }
    async insertSite(url, robot) {
        if (!this.db) throw new Error("Database not connected.");

        const domain = new URL(url).hostname;

        const statement = `
          INSERT OR REPLACE INTO sites 
          (domain, robots_txt) 
          VALUES (?, ?)
      `;

        return this.db.run(statement, [
            domain, robot
        ]);
    }
    async insertPage(data) {
        if (!this.db) throw new Error("Database not connected.");

        const domain = new URL(data.url).hostname;
        const statement = `
          INSERT OR REPLACE INTO pages 
          (url, site_id, title, description, h1, keywords, status_code, crawl_status) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

        return this.db.run(statement, [
            data.url, data.site_id, data.scrap.title, data.scrap.description, data.scrap.h1, data.scrap.keywords, data.statusCode, data.crawl_status
        ]);
    }
    async close() {
        if (this.db) await this.db.close();
    }
}
