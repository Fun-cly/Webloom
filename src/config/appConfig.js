// src/config/appConfig.js

export const APP_NAME = 'Webloom';
export const CRAWLER_USER_AGENT = 'Mozilla/5.0 (compatible; Webloom/1.0; +https://github.com/funcly/)';

// Connection for BullMQ/Redis
export const REDIS_CONNECTION = {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null, // Best practice to use .env for secrets
};