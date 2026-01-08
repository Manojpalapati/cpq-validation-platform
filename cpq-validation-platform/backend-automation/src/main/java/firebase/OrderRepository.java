package firebase;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import config.Constants;
import config.FirebaseConfig;

import java.util.Map;
import java.util.concurrent.ExecutionException;

public class OrderRepository {
    private Firestore firestore;

    public Map<String, Object> getOrder(String documentId) {
        try {
            ApiFuture<DocumentSnapshot> future = getDb().collection(Constants.FIREBASE_ORDERS_COLLECTION)
                    .document(documentId)
                    .get();
            DocumentSnapshot snapshot = future.get();
            return snapshot.exists() ? snapshot.getData() : null;
        } catch (InterruptedException | ExecutionException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException("Failed to load order " + documentId, e);
        }
    }

    private Firestore getDb() {
        if (firestore == null) {
            firestore = FirebaseConfig.firestore();
        }
        return firestore;
    }
}
