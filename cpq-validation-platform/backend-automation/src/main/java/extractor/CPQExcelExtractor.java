package extractor;

import utils.ExcelUtils;

import java.nio.file.Path;
import java.util.List;
import java.util.Map;

public class CPQExcelExtractor {
    public List<Map<String, String>> extract(Path excelPath) {
        return ExcelUtils.readFirstSheet(excelPath);
    }
}
