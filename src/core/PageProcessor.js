import { default as robotsParser } from 'robots-parser'
import { scraper } from './Scraper';

export class PageProcessor {
    constructor(browser, db) {
        this.browser = browser;
        this.db = db;
    }
    async process(url) {
        let page = await this.browser.newPage()
        try {
            let site = await this.db.getSite(url)
            let robotsTxt = site.robots_txt;
            const robots = robotsParser(url, robotsTxt)

            let result = await page.goto(url)
            let statusCode = result.status()
            let scrap = await scraper(await page.content(), url)

            // Update the current page with scraped data
            let info = { 'statusCode': statusCode, 'url': url, 'crawl_status': 'CRAWLED', 'site_id': site.site_id, 'scrap': scrap }
            await this.db.insertPage(info)

            // Insert discovered URLs as new pages (if allowed by robots.txt)
            for (let i = 0; i < scrap.urls.length; i++) {
                let discoveredUrl = scrap.urls[i];
                if (robots.isAllowed(discoveredUrl, 'googleBot')) {
                    await this.db.insertPage({
                        'site_id': site.site_id,
                        'url': discoveredUrl,
                        'scrap': {}
                    })
                }
            }
        } finally {
            await page.close()
        }
    }
}