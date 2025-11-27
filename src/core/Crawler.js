import { chromium } from 'playwright';
import { queue } from '../queue'
import { Database } from '../storage/database';
import { DiscoveryService } from './DiscoveryService';
import { PageProcessor } from './PageProcessor';
const db = new Database()
export class Crawler {
    async start() {
        this.browser = await chromium.launch();
    }
    async crawl(job) {
        try {
            let url = job.data.url;
            let type = job.data.type;
            await db.connect()
            if (type == 'site') {
                let discover = new DiscoveryService(this.browser, db, queue)
                await discover.discover(url)

            } else if (type == 'page') {
                let page = new PageProcessor(this.browser, db)
                await page.process(url)

            }
        } catch (error) {
            console.error(`Error processing job ${job.id} for url ${job.data.url}:`, error);
            // Optionally rethrow if you want BullMQ to mark it as failed and retry
            throw error;
        }
    }

    async close() {
        this.browser.close()
    }
}
