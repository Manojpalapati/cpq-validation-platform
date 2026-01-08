package sanity;

import org.junit.jupiter.api.Test;
import runner.CPQValidationRunner;
import runner.SainapseValidationRunner;

import static org.junit.jupiter.api.Assertions.assertNotNull;

public class SmokeTest {

    @Test
    void runnersInstantiate() {
        assertNotNull(new CPQValidationRunner());
        assertNotNull(new SainapseValidationRunner());
    }
}
