package firebase;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import config.Constants;
import config.FirebaseConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

public class StatusUpdater {
    private static final Logger log = LoggerFactory.getLogger(StatusUpdater.class);
    private Firestore firestore;

    public void setStatus(String documentId, String status) {
        Map<String, Object> payload = new HashMap<>();
        payload.put("status", status);
        if ("IN_PROGRESS".equals(status)) {
            payload.put("startedAt", Instant.now().toString());
        } else if ("PASSED".equals(status) || "FAILED".equals(status)) {
            payload.put("verifiedAt", Instant.now().toString());
        }

        DocumentReference doc = getDb().collection(Constants.FIREBASE_ORDERS_COLLECTION).document(documentId);
        ApiFuture<WriteResult> future = doc.update(payload);
        try {
            future.get();
            log.info("Order {} status set to {}", documentId, status);
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to update status for " + documentId, e);
        }
    }

    private Firestore getDb() {
        if (firestore == null) {
            firestore = FirebaseConfig.firestore();
        }
        return firestore;
    }
}
