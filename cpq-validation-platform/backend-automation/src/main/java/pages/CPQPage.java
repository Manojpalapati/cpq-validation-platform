package pages;

import com.microsoft.playwright.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utils.WaitUtils;

public class CPQPage {
    private static final Logger log = LoggerFactory.getLogger(CPQPage.class);
    private final Page page;

    public CPQPage(Page page) {
        this.page = page;
    }

    public void open(String url) {
        page.navigate(url);
        WaitUtils.waitForNetworkIdle(page);
        log.info("Opened CPQ page");
    }

    public String downloadQuote(DownloadCallback downloadCallback) {
        // In a real flow we trigger a download and return the local path.
        String summary = page.textContent("body");
        log.info("Fetched CPQ summary (placeholder)");
        return summary;
    }

    @FunctionalInterface
    public interface DownloadCallback {
        void trigger();
    }
}
