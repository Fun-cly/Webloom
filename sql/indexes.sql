-- Primary Key is automatically indexed, but for clarity:
-- site_id INTEGER PRIMARY KEY,

-- Crucial: Ensures domain uniqueness and allows for very fast lookup of site_id by domain.
CREATE UNIQUE INDEX IF NOT EXISTS idx_sites_domain ON sites (domain);
-- Primary Key is automatically indexed, but for clarity:
-- page_id INTEGER PRIMARY KEY,

-- Crucial: Ensures URL uniqueness and allows for very fast existence checks (pre-queueing).
CREATE UNIQUE INDEX IF NOT EXISTS idx_pages_url ON pages (url);

-- Crucial: Optimizes queries that link pages back to the site (JOINs) and site-specific reports.
CREATE INDEX IF NOT EXISTS idx_pages_site_id ON pages (site_id);

-- Highly Recommended: Optimizes fetching URLs that need to be crawled/retried, ordered by status.
CREATE INDEX IF NOT EXISTS idx_pages_crawl_status_url ON pages (crawl_status, url);

-- Optional/Reporting: Useful for quickly finding and reporting broken links (404s).
CREATE INDEX IF NOT EXISTS idx_pages_status_code_url ON pages (status_code, url);

-- Composite Index for site-specific reporting (e.g., all 404s on site X)
CREATE INDEX IF NOT EXISTS idx_pages_site_status_code ON pages (site_id, status_code);