import { default as robotsParser } from 'robots-parser'
import { scraper } from './Scraper';
import * as xml from 'fast-xml-parser';
import axios from 'axios';
import { CRAWL_SETTINGS } from '../config/crawlerSettingss';

export class DiscoveryService {
    constructor(browser, db, queue) {
        this.browser = browser;
        this.db = db;
        this.queue = queue;
    }
    async discover(url) {
        let site = await this.db.getSite(url)
        let robotsTxt;
        if (site) {
            robotsTxt = site.robots_txt;

        } else {
            let robotPage = await this.browser.newPage()
            try {
                await robotPage.goto(url + '/robots.txt')
                robotsTxt = await robotPage.content()
            } finally {
                await robotPage.close()
            }

            await this.db.insertSite(url, robotsTxt)
            site = await this.db.getSite(url)

        }
        const robots = robotsParser(url, robotsTxt)
        const siteMaps = robots.getSitemaps();
        const delay = robots.getCrawlDelay('googleBot') ?? 60;
        if (siteMaps.length >= 1) {
            for (let i = 0; i < siteMaps.length; i++) {
                const parser = new xml.XMLParser({ 'ignoreAttributes': false })
                try {
                    let xmlData = await axios.get(siteMaps[i])
                    for (let x = 0; x < parser.parse(xmlData.data).urlset.url.length; x++) {
                        let loc = parser.parse(xmlData.data).urlset.url[x].loc
                        if (robots.isAllowed(loc, 'googleBot'))
                            await this.db.insertPage({ 'site_id': site.site_id, 'url': loc, 'scrap': {} })

                    };
                } catch (e) {
                    console.error(e.message)
                }
            }
        } else {
            let page = await this.browser.newPage()
            try {
                await page.goto(url)
                let scrap = await scraper(await page.content(), url)
                for (let i = 0; i < scrap.urls.length; i++) {
                    let url = scrap.urls[i];
                    if (robots.isAllowed(url, 'googleBot'))
                        await this.db.insertPage({ 'site_id': site.site_id, 'url': url, 'scrap': {} })

                }
            } finally {
                await page.close()
            }
        }
        const uncrawledPages = await this.db.getUncrawledPages(site.site_id);
        for (let j = 0; j < uncrawledPages.length; j++) {
            let url = uncrawledPages[j].url;
            if (robots.isAllowed(url, 'googleBot'))
                await this.queue.add(`page:${url}`,
                    { 'url': url, 'type': 'page' },
                    {
                        removeOnComplete: true,
                        removeOnFail: true,
                        // Ensure delay is in milliseconds. robots-parser often returns seconds.
                        // If delay is small (< 1000), assume it's seconds and convert.
                        // Otherwise use DEFAULT_CRAWL_DELAY_MS
                        delay: (delay ? (delay < 1000 ? delay * 1000 : delay) : CRAWL_SETTINGS.DEFAULT_CRAWL_DELAY_MS) * j
                    })
        }
    }
}