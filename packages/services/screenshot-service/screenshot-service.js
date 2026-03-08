const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs/promises');

class ScreenshotService {
    constructor() {
        this.browser = null;
    }

    /**
     * Capture a screenshot of a URL
     */
    async capture(url, options = {}) {
        const {
            fullPage = false,
            timeout = 30000,
            viewport = { width: 1280, height: 720 },
            outputPath = path.join(process.cwd(), 'backups', 'screenshots', `${Date.now()}.png`)
        } = options;

        try {
            // Ensure output directory exists
            await fs.mkdir(path.dirname(outputPath), { recursive: true });

            if (!this.browser) {
                this.browser = await chromium.launch({ headless: true });
            }

            const context = await this.browser.newContext({
                viewport,
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });

            const page = await context.newPage();
            
            try {
                await page.goto(url, { waitUntil: 'networkidle', timeout });
                
                // Optional: Wait for some time to ensure dynamic content loads
                await page.waitForTimeout(1000);

                await page.screenshot({
                    path: outputPath,
                    fullPage
                });

                console.log(`[ScreenshotService] Captured ${url} -> ${outputPath}`);
                return outputPath;
            } finally {
                await page.close();
                await context.close();
            }
        } catch (error) {
            console.error(`[ScreenshotService] Error capturing ${url}:`, error.message);
            throw error;
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

module.exports = { ScreenshotService };
