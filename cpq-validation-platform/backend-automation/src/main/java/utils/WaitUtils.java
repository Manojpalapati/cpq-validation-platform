package utils;

import com.microsoft.playwright.Page;
import com.microsoft.playwright.options.LoadState;

public final class WaitUtils {
    private WaitUtils() {
    }

    public static void waitForNetworkIdle(Page page) {
        page.waitForLoadState(LoadState.NETWORKIDLE);
    }
}
