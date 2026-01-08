package browser;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import config.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Manages browser context with session reuse via Playwright storageState.
 * Loads saved session from auth/cpq.json for headless automation runs.
 */
public final class BrowserContextManager {
    private static final Logger log = LoggerFactory.getLogger(BrowserContextManager.class);
    private static BrowserContext sharedContext;

    private BrowserContextManager() {
    }

    /**
     * Creates or returns a shared browser context with saved session state.
     * Throws exception if session file doesn't exist.
     * 
     * @return BrowserContext with loaded storageState
     * @throws IllegalStateException if auth/cpq.json doesn't exist
     */
    public static BrowserContext getContextWithStorage() {
        if (sharedContext == null) {
            Path sessionFile = Paths.get(Constants.CPQ_STORAGE_STATE);
            
            if (!Files.exists(sessionFile)) {
                throw new IllegalStateException(
                    String.format(
                        "Session file not found: %s%n" +
                        "Please run SaveSessionTest first to authenticate and save your session.%n" +
                        "The test will open a browser for you to complete Okta MFA login.",
                        sessionFile.toAbsolutePath()
                    )
                );
            }
            
            Browser browser = PlaywrightManager.getBrowser(true); // Always headless for automation
            
            Browser.NewContextOptions options = new Browser.NewContextOptions()
                    .setStorageStatePath(sessionFile)
                    .setAcceptDownloads(true);
            
            sharedContext = browser.newContext(options);
            log.info("Created browser context with saved session from: {}", sessionFile.toAbsolutePath());
        }
        return sharedContext;
    }

    /**
     * Creates a new page using the shared context with saved session.
     * 
     * @return Page instance with authenticated session
     */
    public static Page newPageWithStorage() {
        return getContextWithStorage().newPage();
    }

    /**
     * Closes the shared context. Call this when automation is complete.
     */
    public static void closeContext() {
        if (sharedContext != null) {
            sharedContext.close();
            sharedContext = null;
            log.info("Browser context closed");
        }
    }
}
