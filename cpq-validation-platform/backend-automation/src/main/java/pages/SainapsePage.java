package pages;

import com.microsoft.playwright.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utils.WaitUtils;

public class SainapsePage {
    private static final Logger log = LoggerFactory.getLogger(SainapsePage.class);
    private final Page page;

    public SainapsePage(Page page) {
        this.page = page;
    }

    public void open(String url) {
        page.navigate(url);
        WaitUtils.waitForNetworkIdle(page);
        log.info("Opened Sainapse page");
    }

    public String extractFormJson() {
        // Placeholder extractor to be expanded with real selectors.
        String payload = page.textContent("body");
        log.info("Extracted Sainapse form payload (truncated)");
        return payload == null ? "" : payload;
    }
}
