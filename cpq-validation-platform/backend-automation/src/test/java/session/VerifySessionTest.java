package session;

import browser.BrowserContextManager;
import browser.PlaywrightManager;
import com.microsoft.playwright.Page;
import config.Constants;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Files;
import java.nio.file.Paths;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * Verification test to confirm saved session works for headless automation.
 * 
 * PREREQUISITE: Run SaveSessionTest first to create auth/cpq.json
 * 
 * This test:
 * 1. Loads saved session from auth/cpq.json
 * 2. Opens CPQ homepage in headless mode
 * 3. Verifies no login page appears (session is valid)
 */
public class VerifySessionTest {
    private static final Logger log = LoggerFactory.getLogger(VerifySessionTest.class);

    @BeforeAll
    static void checkSessionExists() {
        var sessionFile = Paths.get(Constants.CPQ_STORAGE_STATE);
        assertTrue(Files.exists(sessionFile), 
                "Session file must exist. Run SaveSessionTest first: " + sessionFile.toAbsolutePath());
    }

    @Test
    void verifySessionWorksForCPQ() {
        log.info("========================================");
        log.info("VERIFYING SAVED SESSION");
        log.info("========================================");

        // Get page with saved session (headless)
        Page page = BrowserContextManager.newPageWithStorage();
        
        try {
            // Navigate to CPQ - adjust URL as needed
            String cpqUrl = System.getenv().getOrDefault("CPQ_BASE_URL", 
                    "https://your-cpq-instance.oracle.com");
            
            log.info("Navigating to CPQ: {}", cpqUrl);
            page.navigate(cpqUrl);
            
            // Wait for page to load
            page.waitForLoadState();
            
            // Check that we're NOT on a login page
            String currentUrl = page.url();
            String pageTitle = page.title();
            String pageContent = page.content();
            
            log.info("Current URL: {}", currentUrl);
            log.info("Page title: {}", pageTitle);
            
            // Verify we're not redirected to login
            assertFalse(currentUrl.contains("login") || currentUrl.contains("okta") || 
                       currentUrl.contains("sso") || currentUrl.contains("signin"),
                    "Should not be on login page. Current URL: " + currentUrl);
            
            // Verify page has some content (not a blank login page)
            assertFalse(pageContent.isBlank(), "Page should have content");
            
            log.info("========================================");
            log.info("SESSION VERIFICATION PASSED!");
            log.info("Headless automation can proceed with saved session.");
            log.info("========================================");
            
        } finally {
            page.close();
        }
    }

    @AfterAll
    static void cleanup() {
        BrowserContextManager.closeContext();
        PlaywrightManager.close();
    }
}
