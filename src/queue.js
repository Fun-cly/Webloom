import { Queue } from 'bullmq'
import { CRAWL_SETTINGS } from './config/crawlerSettings';
export const queue = new Queue('crawler', { 'connection': CRAWL_SETTINGS.REDIS_CONNECTION });

