package browser;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Playwright;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Singleton holder for Playwright and a shared Chromium instance.
 * Supports both headed and headless modes.
 */
public final class PlaywrightManager {
    private static final Logger log = LoggerFactory.getLogger(PlaywrightManager.class);
    private static Playwright playwright;
    private static Browser browser;
    private static boolean headlessMode = true;

    private PlaywrightManager() {
    }

    /**
     * Get browser instance in headless mode (default).
     */
    public static synchronized Browser getBrowser() {
        return getBrowser(true);
    }

    /**
     * Get browser instance with configurable headless mode.
     * 
     * @param headless true for headless mode, false for headed mode
     */
    public static synchronized Browser getBrowser(boolean headless) {
        if (browser == null || headlessMode != headless) {
            close(); // Close existing browser if mode changed
            headlessMode = headless;
            playwright = Playwright.create();
            
            BrowserType.LaunchOptions options = new BrowserType.LaunchOptions()
                    .setHeadless(headless)
                    .setArgs(java.util.Arrays.asList(
                            "--disable-blink-features=AutomationControlled",
                            "--disable-dev-shm-usage",
                            "--no-sandbox"
                    ));
            
            browser = playwright.chromium().launch(options);
            log.info("Chromium launched in {} mode", headless ? "headless" : "headed");
        }
        return browser;
    }

    public static synchronized void close() {
        if (browser != null) {
            browser.close();
            browser = null;
        }
        if (playwright != null) {
            playwright.close();
            playwright = null;
        }
        log.info("Playwright resources closed");
    }
}
