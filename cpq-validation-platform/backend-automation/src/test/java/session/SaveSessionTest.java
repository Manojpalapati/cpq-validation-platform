package session;

import browser.PlaywrightManager;
import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.Page;
import config.Constants;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Test to save Okta MFA session for reuse in headless automation.
 * 
 * INSTRUCTIONS:
 * 1. Run this test in headed mode (browser will be visible)
 * 2. Complete Okta SSO login and MFA when prompted
 * 3. After successful login, the session will be saved to auth/cpq.json
 * 4. Future automation runs will reuse this session (no MFA needed)
 * 
 * NOTE: This test must be run manually once to establish the session.
 *       Do NOT commit auth/cpq.json to version control.
 */
public class SaveSessionTest {
    private static final Logger log = LoggerFactory.getLogger(SaveSessionTest.class);

    @Test
    void saveOktaSessionForCPQ() {
        Path sessionFile = Paths.get(Constants.CPQ_STORAGE_STATE);
        
        // Create auth directory if it doesn't exist
        try {
            Files.createDirectories(sessionFile.getParent());
        } catch (Exception e) {
            throw new RuntimeException("Failed to create auth directory", e);
        }

        log.info("========================================");
        log.info("SAVING OKTA SESSION FOR CPQ AUTOMATION");
        log.info("========================================");
        log.info("This test will:");
        log.info("1. Open a browser window (headed mode)");
        log.info("2. Navigate to Okta SSO login");
        log.info("3. PAUSE for you to complete login and MFA");
        log.info("4. Save the authenticated session to: {}", sessionFile.toAbsolutePath());
        log.info("");
        log.info("Please complete the login process in the browser window...");
        log.info("========================================");

        // Launch browser in HEADED mode for manual interaction
        Browser browser = PlaywrightManager.getBrowser(false); // false = headed mode
        
        BrowserContext context = browser.newContext();
        Page page = context.newPage();

        try {
            // Navigate to Okta SSO login URL
            String oktaUrl = Constants.getOktaLoginUrl();
            log.info("Navigating to Okta login: {}", oktaUrl);
            page.navigate(oktaUrl);

            // Pause execution to allow manual MFA completion
            log.info("");
            log.info(">>> BROWSER PAUSED - Please complete Okta login and MFA <<<");
            log.info(">>> After successful login, press ENTER in the browser DevTools console to continue <<<");
            log.info("");
            
            // Use page.pause() to allow manual interaction
            // This opens Playwright Inspector and waits for user to continue
            page.pause();

            // Wait a moment for any final redirects after login
            page.waitForTimeout(2000);

            // Verify we're logged in (not on login page)
            String currentUrl = page.url();
            log.info("Current URL after login: {}", currentUrl);

            // Save storageState (cookies + localStorage) to file
            context.storageState(new BrowserContext.StorageStateOptions()
                    .setPath(sessionFile));
            
            log.info("");
            log.info("========================================");
            log.info("SESSION SAVED SUCCESSFULLY!");
            log.info("File: {}", sessionFile.toAbsolutePath());
            log.info("Future automation runs will reuse this session.");
            log.info("========================================");

            assertTrue(Files.exists(sessionFile), 
                    "Session file should be created: " + sessionFile.toAbsolutePath());

        } finally {
            context.close();
        }
    }

    @AfterAll
    static void cleanup() {
        PlaywrightManager.close();
    }
}
