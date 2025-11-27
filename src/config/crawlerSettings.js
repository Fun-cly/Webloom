// src/config/crawlerSettings.js

export const CRAWL_SETTINGS = {
    // Playwright settings
    HEADLESS: process.env.HEADLESS !== 'false', // Run browser in background?
    PAGE_LOAD_TIMEOUT: 30000, // 30 seconds

    // robots.txt and scheduling
    DEFAULT_CRAWL_DELAY_MS: 5000, // 5 seconds default delay if robots.txt doesn't specify
    MAX_DEPTH: 5, // Limit crawling to 5 internal link hops

    // Resources
    REDIS_CONNECTION: process.env.REDIS_CONNECTION || 'redis://127.0.0.1:6379',
    DB_PATH: process.env.DB_PATH || './src/storage/crawl_data.db',

    // Seed URLs
    SEED_URLS: [
        'https://example.com',
        // Add more URLs here
    ],

    // Worker settings
    WORKER: {
        CONCURRENCY: 1,
        LIMITER: {
            max: 1,
            duration: 1000, // 1 job per second
        }
    }
};
