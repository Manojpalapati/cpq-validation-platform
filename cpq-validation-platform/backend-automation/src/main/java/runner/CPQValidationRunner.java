package runner;

import browser.BrowserContextManager;
import browser.DownloadManager;
import com.microsoft.playwright.Page;
import extractor.CPQExcelExtractor;
import firebase.ResultWriter;
import firebase.StatusUpdater;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pages.CPQPage;
import processor.ComparatorEngine;
import processor.ResultAggregator;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;

public class CPQValidationRunner {
    private static final Logger log = LoggerFactory.getLogger(CPQValidationRunner.class);
    private final StatusUpdater statusUpdater = new StatusUpdater();
    private final ResultWriter resultWriter = new ResultWriter();
    private final CPQExcelExtractor excelExtractor = new CPQExcelExtractor();
    private final ComparatorEngine comparator = new ComparatorEngine();
    private final ResultAggregator aggregator = new ResultAggregator();

    public void run(String documentId, String cpqUrl) {
        statusUpdater.setStatus(documentId, "IN_PROGRESS");

        Page page = BrowserContextManager.newPageWithStorage();
        CPQPage cpq = new CPQPage(page);
        cpq.open(cpqUrl);

        DownloadManager downloadManager = new DownloadManager();
        Path excelPath = downloadManager.waitForDownload(page, () -> {
            // Placeholder trigger logic; real implementation clicks export.
            page.click("body");
        });

        List<Map<String, String>> cpqRows = excelExtractor.extract(excelPath);
        boolean matched = comparator.areEqual(cpqRows, cpqRows); // placeholder self-compare
        Map<String, Object> summary = aggregator.summarize(matched, cpqRows, cpqRows);
        resultWriter.writeResult(documentId, summary);

        statusUpdater.setStatus(documentId, matched ? "PASSED" : "FAILED");
        log.info("CPQ validation finished for {} with matched={}", documentId, matched);
    }
}
