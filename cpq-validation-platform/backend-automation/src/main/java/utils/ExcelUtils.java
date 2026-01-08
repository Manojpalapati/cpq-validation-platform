package utils;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public final class ExcelUtils {
    private static final Logger log = LoggerFactory.getLogger(ExcelUtils.class);

    private ExcelUtils() {
    }

    public static List<Map<String, String>> readFirstSheet(Path path) {
        List<Map<String, String>> rows = new ArrayList<>();
        try (XSSFWorkbook workbook = new XSSFWorkbook(path.toFile())) {
            XSSFSheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.rowIterator();
            if (!rowIterator.hasNext()) {
                return rows;
            }
            Row headerRow = rowIterator.next();
            List<String> headers = new ArrayList<>();
            headerRow.forEach(cell -> headers.add(cell.getStringCellValue()));

            while (rowIterator.hasNext()) {
                Row row = rowIterator.next();
                Map<String, String> rowMap = new HashMap<>();
                int idx = 0;
                for (Cell cell : row) {
                    String header = idx < headers.size() ? headers.get(idx) : "col" + idx;
                    rowMap.put(header, cell.toString());
                    idx++;
                }
                rows.add(rowMap);
            }
            log.info("Read {} rows from {}", rows.size(), path);
            return rows;
        } catch (IOException | InvalidFormatException e) {
            throw new IllegalStateException("Failed to read excel file " + path, e);
        }
    }
}
