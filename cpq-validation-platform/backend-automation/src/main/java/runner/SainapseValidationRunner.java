package runner;

import browser.BrowserContextManager;
import com.microsoft.playwright.Page;
import extractor.FormDataExtractor;
import firebase.ResultWriter;
import firebase.StatusUpdater;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import pages.SainapsePage;
import processor.DataCleaner;
import processor.ResultAggregator;

import java.util.List;
import java.util.Map;

public class SainapseValidationRunner {
    private static final Logger log = LoggerFactory.getLogger(SainapseValidationRunner.class);
    private final StatusUpdater statusUpdater = new StatusUpdater();
    private final ResultWriter resultWriter = new ResultWriter();
    private final FormDataExtractor formDataExtractor = new FormDataExtractor();
    private final DataCleaner cleaner = new DataCleaner();
    private final ResultAggregator aggregator = new ResultAggregator();

    public void run(String documentId, String sainapseUrl) {
        statusUpdater.setStatus(documentId, "IN_PROGRESS");

        Page page = BrowserContextManager.newPageWithStorage();
        SainapsePage sainapsePage = new SainapsePage(page);
        sainapsePage.open(sainapseUrl);

        Map<String, Object> rawData = formDataExtractor.extract(sainapsePage);
        Map<String, Object> cleaned = cleaner.clean(rawData);
        // Placeholder comparison: treat cleaned map as single-row dataset
        List<Map<String, String>> rows = List.of(cleaned.entrySet().stream()
                .collect(java.util.stream.Collectors.toMap(Map.Entry::getKey, e -> String.valueOf(e.getValue()))));

        boolean matched = true; // placeholder
        Map<String, Object> summary = aggregator.summarize(matched, rows, rows);
        resultWriter.writeResult(documentId, summary);

        statusUpdater.setStatus(documentId, matched ? "PASSED" : "FAILED");
        log.info("Sainapse validation finished for {} with matched={}", documentId, matched);
    }
}
