package processor;

import java.util.List;
import java.util.Map;
import java.util.Objects;

public class ComparatorEngine {
    public boolean areEqual(List<Map<String, String>> expected, List<Map<String, String>> actual) {
        if (expected.size() != actual.size()) {
            return false;
        }
        for (int i = 0; i < expected.size(); i++) {
            if (!Objects.equals(expected.get(i), actual.get(i))) {
                return false;
            }
        }
        return true;
    }
}
