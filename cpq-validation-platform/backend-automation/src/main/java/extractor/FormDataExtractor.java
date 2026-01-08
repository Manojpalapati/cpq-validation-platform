package extractor;

import pages.SainapsePage;
import utils.JsonUtils;

import java.util.Map;

public class FormDataExtractor {
    public Map<String, Object> extract(SainapsePage page) {
        String json = page.extractFormJson();
        return JsonUtils.toMap(json);
    }
}
