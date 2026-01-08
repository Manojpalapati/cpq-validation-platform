package processor;

import java.util.HashMap;
import java.util.Map;

public class ColumnMapper {
    /**
    * Maps source keys to standardized keys using the provided map.
    */
    public Map<String, Object> mapKeys(Map<String, Object> source, Map<String, String> mapping) {
        Map<String, Object> result = new HashMap<>();
        source.forEach((key, value) -> {
            String target = mapping.getOrDefault(key, key);
            result.put(target, value);
        });
        return result;
    }
}
