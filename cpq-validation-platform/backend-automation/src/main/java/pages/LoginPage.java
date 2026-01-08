package pages;

import com.microsoft.playwright.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import utils.WaitUtils;

public class LoginPage {
    private static final Logger log = LoggerFactory.getLogger(LoginPage.class);
    private final Page page;

    public LoginPage(Page page) {
        this.page = page;
    }

    public void open(String url) {
        page.navigate(url);
        log.info("Opened login page: {}", url);
    }

    public void waitForOktaSession() {
        WaitUtils.waitForNetworkIdle(page);
        log.info("Okta session assumed from storageState");
    }
}
