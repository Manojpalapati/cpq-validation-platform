package config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.cloud.FirestoreClient;
import com.google.firestore.v1.WriteResult;
import com.google.cloud.firestore.Firestore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.List;

/**
 * Initializes Firebase using a service account JSON provided via environment variable.
 * The variable may be either a path to the JSON file or the JSON content itself.
 */
public final class FirebaseConfig {
    private static final Logger log = LoggerFactory.getLogger(FirebaseConfig.class);
    private static final String CREDENTIAL_ENV = "FIREBASE_SERVICE_ACCOUNT_JSON";
    private static volatile boolean initialized = false;

    private FirebaseConfig() {
    }

    public static synchronized Firestore firestore() {
        if (!initialized) {
            try {
                GoogleCredentials credentials = loadCredentials();
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(credentials)
                        .build();
                FirebaseApp.initializeApp(options);
                initialized = true;
                log.info("Firebase initialized");
            } catch (IOException e) {
                throw new IllegalStateException("Failed to initialize Firebase", e);
            }
        }
        return FirestoreClient.getFirestore();
    }

    private static GoogleCredentials loadCredentials() throws IOException {
        String credentialValue = ConfigLoader.getEnv(CREDENTIAL_ENV);
        // If it looks like a path, attempt to read the file; otherwise treat as raw JSON.
        if (credentialValue.trim().startsWith("{")) {
            log.info("Loading Firebase credentials from inline JSON env");
            return GoogleCredentials.fromStream(new ByteArrayInputStream(credentialValue.getBytes(StandardCharsets.UTF_8)))
                    .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));
        }

        log.info("Loading Firebase credentials from path in env: {}", credentialValue);
        try (FileInputStream serviceAccount = new FileInputStream(credentialValue)) {
            return GoogleCredentials.fromStream(serviceAccount)
                    .createScoped(List.of("https://www.googleapis.com/auth/cloud-platform"));
        }
    }
}
