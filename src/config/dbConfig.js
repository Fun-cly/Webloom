// src/config/dbConfig.js

// The file path for your SQLite database
export const DB_FILE_PATH = process.env.DB_PATH || './data/crawl_data.db'; 
export const DB_TABLES = {
    SITES: 'sites',
    PAGES: 'pages',
};

// Character limit constraints (mirrors the CHECK constraints in schema.sql)
export const SCRAPE_MAX_LENGTH = 300;