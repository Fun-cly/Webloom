/**
 * Resolves a scraped link (href) into a fully absolute URL.
 * @param {string} scrapedHref - The link extracted from the <a> tag (e.g., '/about', 'post-1', 'https://other.com/').
 * @param {string} baseUrl - The full URL of the page where the link was found (e.g., 'https://www.example.com/blog/').
 * @returns {string | null} The fully resolved, absolute URL, or null if resolution fails.
 */
export function resolveUrl(scrapedHref, baseUrl) {
  try {
    const resolvedUrl = new URL(scrapedHref, baseUrl);
    return resolvedUrl.href;

  } catch (error) {
    console.error(`Could not resolve URL: ${scrapedHref} against ${baseUrl}`, error.message);
    return null;
  }
}
