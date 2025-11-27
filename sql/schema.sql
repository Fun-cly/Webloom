CREATE TABLE IF NOT EXISTS sites (
    site_id INTEGER PRIMARY KEY,
    domain TEXT NOT NULL UNIQUE,
    robots_txt TEXT -- e.g., 'FOUND', 'NOT_FOUND', 'BLOCKED'
    -- sitemap_url TEXT,
    -- last_crawled DATETIME
);
CREATE TABLE IF NOT EXISTS pages (
    page_id INTEGER PRIMARY KEY,
    site_id INTEGER NOT NULL,
    url TEXT NOT NULL UNIQUE,
    url_path TEXT, -- Optional: Stores the path part of the URL for easier filtering (e.g., /products/123)
    crawl_status TEXT NOT NULL DEFAULT 'UNCRAWLED', -- e.g., 'UNCRAWLED', 'CRAWLED', 'FAILED'
    status_code INTEGER,
    title VARCHAR(300),
    description VARCHAR(300),
    h1 VARCHAR(300),
    keywords VARCHAR(300),
    crawled_at DATETIME,
    
    -- Define the Foreign Key constraint
    FOREIGN KEY (site_id) REFERENCES sites (site_id) ON DELETE CASCADE
);