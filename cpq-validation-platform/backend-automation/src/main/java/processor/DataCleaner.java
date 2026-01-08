package processor;

import java.util.Map;
import java.util.stream.Collectors;

public class DataCleaner {
    public Map<String, Object> clean(Map<String, Object> raw) {
        return raw.entrySet().stream()
                .filter(e -> e.getValue() != null)
                .filter(e -> !(e.getValue() instanceof String s) || !s.isBlank())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
