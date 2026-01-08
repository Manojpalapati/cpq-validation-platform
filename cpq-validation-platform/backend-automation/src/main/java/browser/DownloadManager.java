package browser;

import com.microsoft.playwright.Download;
import com.microsoft.playwright.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.Path;

public class DownloadManager {
    private static final Logger log = LoggerFactory.getLogger(DownloadManager.class);

    public Path waitForDownload(Page page, Runnable action) {
        Download download = page.waitForDownload(action);
        Path path = download.path();
        log.info("Download completed: {}", path);
        return path;
    }
}
