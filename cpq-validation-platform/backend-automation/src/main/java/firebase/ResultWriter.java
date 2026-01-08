package firebase;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import config.Constants;
import config.FirebaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;
import java.util.concurrent.ExecutionException;

public class ResultWriter {
    private static final Logger log = LoggerFactory.getLogger(ResultWriter.class);
    private Firestore firestore;

    public void writeResult(String documentId, Map<String, Object> summary) {
        DocumentReference doc = getDb().collection(Constants.FIREBASE_ORDERS_COLLECTION).document(documentId);
        ApiFuture<WriteResult> future = doc.update(summary);
        try {
            future.get();
            log.info("Wrote result for {}", documentId);
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to write result for " + documentId, e);
        }
    }

    private Firestore getDb() {
        if (firestore == null) {
            firestore = FirebaseConfig.firestore();
        }
        return firestore;
    }
}
