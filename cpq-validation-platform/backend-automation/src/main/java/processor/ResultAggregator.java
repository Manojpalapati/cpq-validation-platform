package processor;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ResultAggregator {
    public Map<String, Object> summarize(boolean matched, List<Map<String, String>> expected, List<Map<String, String>> actual) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("matched", matched);
        summary.put("expectedCount", expected.size());
        summary.put("actualCount", actual.size());
        summary.put("verifiedAt", Instant.now().toString());
        return summary;
    }
}
