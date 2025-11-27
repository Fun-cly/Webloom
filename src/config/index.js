// src/config/index.js

import * as AppConfig from './appConfig.js';
import * as DBConfig from './dbConfig.js';
import * as CrawlSettings from './crawlerSettings.js';

export const config = {
    ...AppConfig,
    db: DBConfig,
    crawler: CrawlSettings,
};