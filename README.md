# Webloom

A robust Node.js web crawler built with Playwright, BullMQ, and SQLite.

## Features

- **Scalable Queueing**: Uses BullMQ (Redis) to manage crawl jobs.
- **Headless Browsing**: Uses Playwright for accurate rendering and interaction.
- **Politeness**: Respects `robots.txt` and implements configurable delays.
- **Persistence**: Stores results in a local SQLite database.
- **Robustness**: Handles errors and retries gracefully.

## Prerequisites

- [Bun](https://bun.sh) (or Node.js)
- [Redis](https://redis.io/) (running locally or accessible via URL)

## Installation

1.  Clone the repository.
2.  Install dependencies:

    ```bash
    bun install
    ```

3.  Configure environment variables:

    Copy the example file:
    ```bash
    cp .env.example .env
    ```
    
    Edit `.env` if your Redis is not at `localhost:6379`.

## Usage

To start the crawler:

```bash
bun run index.js
```

This will:
1.  Initialize the SQLite database.
2.  Start the BullMQ worker.
3.  Seed the queue with the starting URL (configured in `index.js`).

## Configuration

Settings can be modified in `src/core/config/crawlerSettings.js` or via environment variables:

-   `REDIS_CONNECTION`: Redis connection string.
-   `DB_PATH`: Path to SQLite database file.
-   `HEADLESS`: Run browser in headless mode (default: true).
-   `SEED_URLS`: List of initial URLs to crawl.
-   `WORKER`: Worker settings (concurrency, rate limiting).

## License

MIT
