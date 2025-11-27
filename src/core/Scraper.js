import * as cheerio from 'cheerio';
import { resolveUrl } from '../utils/urlResolver';
export async function scraper(content, baseUrl) {
  const $ = cheerio.load(content)
  let title = $('title').text()
  let h1 = $('h1').text()
  let description = $('meta[name="description"]').attr('content')
  let keywords = $('meta[name="keywords"]').attr('content')
  let links = $('a').toArray();
  let urls = []
  for (let i = 0; i < links.length; i++) {
    const link = $(links[i]);
    let href = link.attr().href
    urls.push(resolveUrl(href, baseUrl))
  }
  return {
    'title': title?.trim().substring(0, 300),
    'description': description?.trim().substring(0, 300),
    'keywords': keywords?.trim().substring(0, 300),
    'h1': h1?.trim().substring(0, 300),
    'urls': urls
  }
}

