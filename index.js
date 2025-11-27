import { Crawler } from './src/core/Crawler';
import { Worker } from 'bullmq'
import { CRAWL_SETTINGS } from './src/config/crawlerSettings';
import { queue } from './src/queue';

const c = new Crawler()
await c.start()

// Seed the queue with URLs from configuration
for (const url of CRAWL_SETTINGS.SEED_URLS) {
    await queue.add('site', { 'url': url, 'type': 'site' });
    console.log(`Added ${url} to queue`);
}

const worker = new Worker('crawler', c.crawl.bind(c), {
    'autorun': true,
    'connection': CRAWL_SETTINGS.REDIS_CONNECTION,
    'concurrency': CRAWL_SETTINGS.WORKER.CONCURRENCY,
    'limiter': CRAWL_SETTINGS.WORKER.LIMITER
});

console.log('Crawler worker started');

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Closing crawler...');
    await c.close();
    await worker.close();
    process.exit(0);
});